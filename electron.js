const { app, BrowserWindow, Tray, nativeImage } = require("electron");
const path = require("path");
const APP_NAME = "Excalidraw";
const ICON_TRAY = nativeImage.createFromPath(
  path.join(__dirname, "./public/icon-tray.png"),
);

const ICON_DOCK = nativeImage.createFromPath(
  path.join(__dirname, "./public/icon-dock.png"),
);

let win, tray;
app.whenReady().then(() => {
  createWindow();
  initTray();

  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// macos 下设置程序坞图标
if (process.platform === "darwin") {
  app.dock.setIcon(ICON_DOCK);
}

// 关闭所有窗口时退出应用 (Windows & Linux)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// 创建主窗口
function createWindow() {
  // console.log(ICON, 'ICON')
  win = new BrowserWindow({
    width: 1050,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      backgroundThrottling: false, // 后台模式不限流确保应用在后台正常运行
    },
  });
  // win.loadFile(path.join(__dirname, "./build/index.html"));
  win.loadURL("https://excalidraw.com/");
}

// 使用 PNG 或 JPG 文件创建托盘、dock和应用程序图标
function initTray() {
  tray = new Tray(ICON_TRAY);
  tray.setToolTip(`${APP_NAME}正在后台运行`);
  // 监听托盘点击事件来控制窗口的显示和隐藏
  tray.on("click", () => {
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  });
}
