import { app } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
const unhandled = require("electron-unhandled");
const shell = require("electron").shell;

const isProd = process.env.NODE_ENV === "production";

unhandled();

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + "\\preload.js",
      enableRemoteModule: true,
    },
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
