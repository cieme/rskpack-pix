import {
  type FederatedPointerEvent,
  Sprite,
  Text,
  Assets,
  NineSliceSprite,
} from "pixi.js";
import { nextTick } from "vue";
import { Components, genLabel } from "@/core";
import { LinkArrow } from "@/controller/tools/LinkArrow";
import { store } from "@/store/store";
export class CommonComponents extends Components {
  public defaultConfig = {
    Label: "组件",
    Sprite: "./images/source/icon_source_000.png",
  };

  selectNode: NineSliceSprite = null;
  _labelComponent: Text = null;

  constructor(config: any) {
    super(config);
    this.init();
    nextTick(() => {
      this.onLoad();
      this.setSelectEvent();
    });
    let timer = setTimeout(() => {
      this.onStart();
      clearTimeout(timer);
    }, 0);
  }
  private init() {
    this.node.label = this.defaultConfig.Label;
    this.node.interactive = true;
    /*  */
    const sprite = new Sprite();
    sprite.anchor.set(0.5, 0.5);
    sprite.label = "icon";
    Assets.load(this.defaultConfig.Sprite).then((texture) => {
      sprite.texture = texture;
    });
    /*  */
    const bg = this.genBg(0x383e50);
    bg.width = 40;
    bg.height = 40;
    bg.anchor.set(0.5, 0.5);
    bg.label = "背景色";
    /*  */
    const selectNode = this.genSelect(0x407cf4);
    selectNode.width = 40;
    selectNode.height = 40;
    selectNode.pivot.set(20, 20); // 这行不太理解
    selectNode.label = "选中";
    selectNode.visible = false;
    this.selectNode = selectNode;
    /* 文字 */
    const text = genLabel(this.defaultConfig.Label);
    this._labelComponent = text;
    text.label = "label";
    text.anchor.set(0.5, 0);
    text.y = 20;
    /* 箭头 */
    const arrow = new LinkArrow();
    arrow.node.anchor.set(0, 0.5);
    arrow.node.x = 20;
    arrow.node.y = 0;

    /* 添加到容器上 */
    this.node.addChild(bg, selectNode, sprite, text, arrow.node);
    /*  */
  }
  protected onLoad() {}
  protected onStart() {}
  private setSelectEvent() {
    this.node.on("click", (event: FederatedPointerEvent) => {
      if (event.ctrlKey) {
        this.choose();
      } else {
        this.chooseSelf();
      }
    });
  }
  private chooseSelf() {
    store.StoreScene.value.componentList.forEach((value) => {
      if (value.uniqueId === this.uniqueId) return;
      (value as CommonComponents).selectNode.visible = false;
    });
    store.StoreScene.value.selectComponentList.clear();
    store.StoreScene.value.selectComponentList.set(this.uniqueId, this);
    this.selectNode.visible = true;
  }
  private choose() {
    store.StoreScene.value.selectComponentList.set(this.uniqueId, this);
    this.selectNode.visible = true;
  }
  removeEvent() {}
  override initVue(config: any) {}

  updateLabel(text: string) {
    this._labelComponent.text = text;
  }
}
