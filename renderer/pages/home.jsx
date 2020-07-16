import React from "react";
import Head from "next/Head";
import WindowLayout from "../components/WindowLayout";

import "antd/dist/antd.css";

import electron from "electron";
const unhandled =
  electron.remote || false ? require("electron-unhandled") : null;

if (unhandled) unhandled();

const Home = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Dawn of War Mod Installer</title>
      </Head>
      <WindowLayout />
    </React.Fragment>
  );
};

export default Home;
