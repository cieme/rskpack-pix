import {
  type TextStyleOptions,
  Sprite,
  Text,
  Container,
  Assets,
  NineSliceSprite,
} from "pixi.js";

import { Components, genLabel } from "@/core";

export default class Source extends Components {
  static defaultConfig = {
    Label: "源",
    Sprite: "./images/source/icon_source_000.png",
  };

  selectNode: NineSliceSprite = null;

  constructor(config: any) {
    super(config);
    this.init();
  }
  init() {
    this.node.label = Source.defaultConfig.Label;
    this.node.interactive = true;
    /*  */
    const sprite = new Sprite();
    sprite.anchor.set(0.5, 0.5);
    sprite.label = "icon";
    Assets.load(Source.defaultConfig.Sprite).then((texture) => {
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
    const text = genLabel(Source.defaultConfig.Label);
    text.anchor.set(0.5, 0);
    text.y = 20;
    /* 添加到容器上 */
    this.node.addChild(bg, selectNode, sprite, text);
  }
  onload() {
    this.setEvent();
  }
  onstart() {}
  setEvent() {
    this.node.on("click", () => {
      this.selectNode.visible = true;
    });
  }
  removeEvent() {}
  override initVue(config: any) {}
}
