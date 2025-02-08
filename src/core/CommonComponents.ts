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

  _N_Select: NineSliceSprite = null;
  _C_Label: Text = null;
  _C_Sprite: Sprite = null;

  constructor(config?: any) {
    super(config);
    nextTick(() => {
      this.runEvent("beforeInit");
      this.init();
      this.runEvent("beforeCreate");
      this.onLoad();
      this.runEvent("created");
      this.setSelectEvent();
    });
    let timer = setTimeout(() => {
      this.runEvent("beforeMounted");
      this.onStart();
      this.runEvent("mounted");
      clearTimeout(timer);
      timer = null;
    }, 0);
  }
  private init() {
    this.node.label = this.defaultConfig.Label;
    this.node.interactive = true;
    /*  */
    const sprite = new Sprite();
    sprite.anchor.set(0.5, 0.5);
    sprite.label = "icon";
    this._C_Sprite = sprite;
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
    const _N_Select = this.genSelect(0x407cf4);
    _N_Select.width = 40;
    _N_Select.height = 40;
    _N_Select.pivot.set(20, 20); // 这行不太理解
    _N_Select.label = "选中";
    _N_Select.visible = false;
    this._N_Select = _N_Select;
    /* 文字 */
    const text = genLabel(this.defaultConfig.Label);
    this._C_Label = text;
    text.label = "label";
    text.anchor.set(0.5, 0);
    text.y = 20;
    /* 箭头 */
    const arrow = new LinkArrow();
    arrow.node.anchor.set(0, 0.5);
    arrow.node.x = 20;
    arrow.node.y = 0;

    /* 添加到容器上 */
    this.node.addChild(bg, _N_Select, sprite, text, arrow.node);
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
      (value as CommonComponents)._N_Select.visible = false;
    });
    store.StoreScene.value.selectComponentList.clear();
    store.StoreScene.value.selectComponentList.set(this.uniqueId, this);
    this._N_Select.visible = true;
  }
  private choose() {
    store.StoreScene.value.selectComponentList.set(this.uniqueId, this);
    this._N_Select.visible = true;
  }

  removeEvent() {}

  override initVue(config: any) {}

  /*  */
  updateLabel(text: string) {
    this._C_Label.text = text;
  }
  updateIcon(url: string) {
    Assets.load(url).then((texture) => {
      this._C_Sprite.texture = texture;
    });
  }
}
