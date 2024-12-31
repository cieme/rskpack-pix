import { type FederatedWheelEvent, Application } from "pixi.js";

import Source from "@/controller/SourceController";
import { store } from "@/store/store";
export async function main() {
  const app = await init();
  for (let i = 0; i < 2; i++) {
    const source = new Source({
      label: "Source",
    });
    source.node.position.x = i * 40;
    source.node.position.y = i * 40;
    app.stage.addChild(source.node);

    store.StoreScene.value.componentList.set(source.uniqueId, source);
  }
  /* 变化 */
  app.ticker.add(() => {
    store.StoreScene.value.componentList.forEach((item) => {
      item.node.rotation += 0.01;
    });
  });
}
async function init() {
  const app = new Application();
  globalThis.__PIXI_APP__ = app;
  await app.init({
    autoStart: false,
    // resizeTo: window,
    sharedTicker: true,
    antialias: true, // default: false 反锯齿
    resolution: window.devicePixelRatio || 1,
    powerPreference: "high-performance",
    preference: "webgpu",
    backgroundColor: 0x333333,
    backgroundAlpha: 1,
  });
  app.stage.label = "_root_stage";

  resize(app);

  document.body.appendChild(app.canvas);

  window.addEventListener("resize", () => resize(app));

  // /* 添加一个全屏事件 */
  // app.stage.interactive = true;
  // /* 鼠标滚动事件 */
  // app.stage.on("wheel", function (event: FederatedWheelEvent) {
  //   console.log("全屏");
  // });
  document.addEventListener("wheel", (e: WheelEvent) => {
    // 判断鼠标滚动方向
    if (e.deltaY > 0) {
      app.stage.scale.set(app.stage.scale.x - 0.1);
    } else {
      app.stage.scale.set(app.stage.scale.x + 0.1);
    }
  });
  /* 拖拽画布 */
  const mouseMove = (e: MouseEvent) => {
    app.stage.position.x += e.movementX;
    app.stage.position.y += e.movementY;
  };
  document.addEventListener("mousedown", (e: MouseEvent) => {
    if (e.button === 1) {
      document.addEventListener("mousemove", mouseMove);
    }
  });
  document.addEventListener("mouseup", (e: MouseEvent) => {
    if (e.button === 1) {
      document.removeEventListener("mousemove", mouseMove);
    }
  });
  return app;
}
function resize(app: Application) {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  /* 设置舞台锚点 */
  app.stage.position.x = app.screen.width / 2;
  app.stage.position.y = app.screen.height / 2;
}