import { Fragment } from "react";
import fs from "fs";
import { List, Input, Button, Row, Col, Space, Progress } from "antd";
import {
  CheckCircleTwoTone,
  ExclamationCircleTwoTone,
  DownloadOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import constants from "../../constants";
import child from "child_process";
import sevenBin from "7zip-bin";
import { extractFull } from "node-7z";
import isArchive from "is-archive";
import { isEmpty } from "lodash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import path from "path";
import os from "os";

import electron from "electron";
const unhandled =
  electron.remote || false ? require("electron-unhandled") : null;

if (unhandled) unhandled();

const getMods = () => {
  try {
    return JSON.parse(fs.readFileSync("mods.json")) || {};
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
  return {};
};

const getConfigurations = () => {
  try {
    return (
      JSON.parse(fs.readFileSync("configurations.json")) || {
        installed_mods: [],
      }
    );
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
  return { installed_mods: [] };
};

const backFillInstalledMods = () => {
  const mods = getMods();
  let installed_mods = [];
  const configurations = getConfigurations();
  if (configurations.installed_mods.length === 0 && !isEmpty(mods)) {
    mods.reverse().forEach((mod) => {
      const _mod = { file_path: "", ...mod };
      installed_mods = [_mod, ...installed_mods];
    });
  } else {
    installed_mods = configurations.installed_mods;
  }
  return installed_mods;
};

export default function Mods() {
  const [configurations, setConfigurations] = useState({
    installed_mods: backFillInstalledMods(),
    dow_directory: constants.DEFAULT_DOW_DIRECTORY,
  });
  const [installStream, setInstallStream] = useState({
    modsToInstall: [...configurations.installed_mods].reverse(),
    streams: [],
  });
  const [installing, setInstalling] = useState(false);
  // const [percent, setPercent] = useState(0);
  const [installed, setInstalled] = useState(false);

  const isProd = process.env.NODE_ENV === "production";
  let pathTo7zip = path.join(
    process.cwd(),
    "resources\\app.asar.unpacked\\node_modules\\7zip-bin",
    sevenBin.path7za
  );

  if (!isProd) {
    pathTo7zip = path.join(
      process.cwd(),
      "node_modules\\7zip-bin",
      sevenBin.path7za
    );
  }

  const installMod = (installStream) => {
    let { streams, modsToInstall } = installStream;
    const mod = modsToInstall.pop();
    const idx = configurations.installed_mods.findIndex((e) => e === mod);
    const temp = mod.file_path.split("\\");
    const file_path = temp[temp.length - 1];

    if (fs.existsSync(configurations.dow_directory)) {
      if (file_path.endsWith(".exe")) {
        const res = child.execFileSync(mod.file_path);

        // setPercent(
        //   Math.floor((idx + 1 / configurations.installed_mods.length) * 100)
        // );
      } else if (!isArchive(file_path)) {
        toast(`Incompatible file type!: ${file_path}`);
      } else if ("extract_locations" in mod) {
        mod.extract_locations.forEach((loc) => {
          const modifiers = "modifiers" in mod ? mod.modifiers : [];
          streams.push(
            extractFull(
              mod.file_path,
              path.join(configurations.dow_directory, loc),
              {
                $bin: pathTo7zip,
                $raw: ["-aoa", ...modifiers],
                $progress: true,
                $spawnOptions: { encoding: "utf8" },
                yes: false,
              }
            )
          );
        });
      } else {
        streams.push(
          extractFull(mod.file_path, configurations.dow_directory, {
            $bin: pathTo7zip,
            $raw: ["-aoa"],
            $progress: true,
            $spawnOptions: { encoding: "utf8" },
            yes: false,
          })
        );
      }
    } else {
      toast(`Invalid DoW Directory!: ${configurations.dow_directory}`);
    }

    streams.forEach((stream) => {
      stream.done = false;
      stream.on("error", (err) => {
        setInstalling(false);
        throw err;
      });

      // stream.on("progress", (progress) => {
      //   const max = (idx / configurations.installed_mods.length) * 100;
      //   const min = percent;
      //   const percentage = progress.percent;

      //   const newPercent = Math.floor((percentage * (max - min)) / 100 + min);

      //   setPercent(newPercent);
      // });

      stream.on("end", () => {
        const _idx = streams.findIndex((s) => s === stream);
        streams[_idx].done = true;
        setInstallStream({ ...installStream, streams });
        if ("shortcut" in mod && (electron.remote || false)) {
          const res = electron.shell.writeShortcutLink(
            path.join(
              os.homedir(),
              "Desktop",
              mod.shortcut.replace("exe", "lnk")
            ),
            {
              target: path.join(configurations.dow_directory, mod.shortcut),
            }
          );
          if (!res) toast(`Unable to create shortcut for ${mod.shortcut}`);
        }
      });
    });

    return { streams, modsToInstall };
  };

  useEffect(() => {
    if (installing) {
      if (
        installStream.modsToInstall.length > 0 &&
        installStream.streams.length === 0
      ) {
        setInstallStream(installMod(installStream));
      } else if (
        installStream.streams.length > 0 &&
        installStream.streams.every((stream) => stream.done)
      ) {
        setInstallStream({ ...installStream, streams: [] });
      } else if (installStream.modsToInstall.length === 0) {
        setInstalling(false);
        setInstalled(true);
      }
    }
  }, [installing, installStream]);

  const handleModSearch = (item) => {
    if (typeof window !== "undefined") {
      const path = window.electron.dialog.showOpenDialogSync({
        properties: ["openFile"],
      });

      if (path) {
        const idx = configurations.installed_mods.findIndex(
          (mod) => mod === item
        );

        const installed_mods = [...configurations.installed_mods];

        installed_mods[idx].file_path = path[0];

        const _configurations = { installed_mods, ...configurations };

        setConfigurations(_configurations);
      }
    }
  };

  const handleSearch = () => {
    if (typeof window !== "undefined") {
      const path = window.electron.dialog.showOpenDialogSync({
        properties: ["openDirectory"],
      });

      if (path) {
        setConfigurations({ dow_directory: path, ...configurations });
      }
    }
  };

  const handleInstall = () => {
    setInstalling(true);
  };

  const handleConfigSave = (data) => {
    fs.writeFileSync("configurations.json", JSON.stringify(data), {
      flag: "w+",
    });
  };

  return (
    <Fragment>
      <Space direction="vertical">
        <h2>DoW Directory</h2>
        <Input.Search
          value={configurations.dow_directory}
          placeholder="Directory"
          enterButton="Search"
          size="large"
          onSearch={() => handleSearch()}
        />
        <List
          header={
            <Space direction="vertical">
              <h2>Mods</h2>
              {configurations.installed_mods.length > 0 && (
                <Button
                  type="primary"
                  shape="round"
                  onClick={() => handleConfigSave(configurations)}
                >
                  Save
                </Button>
              )}
            </Space>
          }
          itemLayout="horizontal"
          dataSource={configurations.installed_mods}
          bordered
          renderItem={(item) => (
            <List.Item>
              <Row align="bottom" gutter={12} style={{ margin: "0 auto" }}>
                <Col flex="auto">
                  {item.file_path && fs.existsSync(item.file_path) ? (
                    <CheckCircleTwoTone
                      twoToneColor="#52c41a"
                      style={{ fontSize: "28px" }}
                    />
                  ) : (
                    <ExclamationCircleTwoTone
                      twoToneColor="#eb2f96"
                      style={{ fontSize: "28px" }}
                    />
                  )}
                </Col>
                <Col>
                  {item.file_name}
                  <Input.Search
                    value={item.file_path}
                    placeholder="Directory"
                    enterButton="Search"
                    size="large"
                    onSearch={() => handleModSearch(item)}
                  />
                </Col>
                <Col flex="auto">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<DownloadOutlined />}
                    href={item.download_link}
                  />
                </Col>
              </Row>
            </List.Item>
          )}
        />
        {/* {(installing || installed) && (
          <Progress type="circle" percent={percent} />
        )} */}
        {configurations.installed_mods.every((mod) =>
          fs.existsSync(mod.file_path)
        ) && (
          <Button
            type="primary"
            shape="round"
            size="large"
            icon={!installed && <DownloadOutlined />}
            onClick={() => handleInstall()}
            loading={installing}
            disabled={installed}
          >
            {installed
              ? " Mods installed"
              : [installing ? "Installing Mods..." : "Install Mods"]}
          </Button>
        )}
        {installed && (
          <CheckCircleTwoTone
            style={{ fontSize: "28px" }}
            twoToneColor="#52c41a"
          />
        )}
      </Space>
    </Fragment>
  );
}
