import { useState } from "react";
import { Space, Button, Col, Row } from "antd";
import fs from "fs";
import electron from "electron";
const ReactJson =
  electron.remote || false ? require("react-json-view").default : null;

const unhandled =
  electron.remote || false ? require("electron-unhandled") : null;

if (unhandled) unhandled();

const getMods = () => {
  try {
    return JSON.parse(fs.readFileSync("mods.json")) || {};
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  return {};
};

export default function Settings() {
  const [mods, setMods] = useState(getMods());

  const handleModSave = (data) => {
    fs.writeFileSync("mods.json", JSON.stringify(data), {
      flag: "w+",
    });
  };

  const handleEdit = ({ updated_src }) => {
    setMods(updated_src);
  };

  return (
    <Space direction="vertical">
      <h2>Edit Mods</h2>
      <Button type="primary" shape="round" onClick={() => handleModSave(mods)}>
        Save
      </Button>

      <ReactJson
        src={mods}
        name={null}
        displayDataTypes={false}
        collapseStringsAfterLength={40}
        iconStyle={"triangle"}
        onEdit={(obj) => handleEdit(obj)}
        onAdd={(obj) => handleEdit(obj)}
        onDelete={(obj) => handleEdit(obj)}
      />
    </Space>
  );
}
