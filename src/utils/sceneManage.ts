import { Application } from "pixi.js";
interface IAppManage {
  app: Application;
  get currentApp(): Application | null;
  set currentApp(app: Application | null);
}
const obj: IAppManage = {
  app: null,
  currentApp: null,
};
export const AppManage = new Proxy(obj, {
  get(target, key) {
    return target[key];
  },
  set(target, key, value) {
    target[key] = value;
    return true;
  },
});
