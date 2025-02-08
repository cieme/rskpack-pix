import { Assets, Sprite, NineSliceSprite, Texture, Container } from "pixi.js";
import { type Ref, reactive } from "vue";
import { uuid } from "@/utils/uuid";

export class Components {
  /** 唯一ID */
  uniqueId: string = uuid();
  /* ref 会类型报错，所以只能模拟一下了 */
  public active = reactive({
    value: false,
  });
  /**
   * 配置参数
   */
  _config = null;
  get config() {
    return this._config;
  }
  set config(value) {
    this._config = value;
  }
  /**
   * 节点
   */
  node: Container = new Container();

  constructor(config) {
    this.config = config;
    this.initVue(config);
  }
  initVue(config: any) {}

  genBg(color?: number): Sprite {
    const sprite = new Sprite();
    Assets.load("./images/icon/default-9.png").then((texture) => {
      sprite.texture = texture;
    });
    if (color) {
      sprite.tint = color;
    }
    return sprite;
  }
  genSelect(color?: number): NineSliceSprite {
    const sprite = new NineSliceSprite({
      texture: Texture.EMPTY,
      leftWidth: 4,
      rightWidth: 4,
      topHeight: 4,
      bottomHeight: 4,
    });
    Assets.load("./images/icon/selected-9.png").then((texture) => {
      sprite.texture = texture;
    });
    if (color) {
      sprite.tint = color;
    }
    return sprite;
  }
  /* 一套事件机制 */
  eventMap = new Map<keyof typeof this.keyList, any[]>();
  keyList = {
    beforeInit: "beforeInit",
    beforeCreate: "beforeCreate",
    created: "created",
    beforeMounted: "beforeMounted",
    mounted: "mounted",
  };
  runEvent(key: keyof typeof this.keyList) {
    this.eventMap.get(key)?.forEach((event) => {
      event.call(this);
    });
  }
  addEventListener(key: keyof typeof this.keyList, event) {
    const hasKey = this.eventMap.has(key);
    if (hasKey) {
      this.eventMap.get(key).push(event);
    } else {
      this.eventMap.set(key, [event]);
    }
  }
  removeEventListener(key: keyof typeof this.keyList, event) {
    if (this.eventMap.has(key)) {
      const index = this.eventMap.get(key).indexOf(event);
      if (index > -1) {
        this.eventMap.get(key).splice(index, 1);
      }
    }
  }
  removeAllEventListeners() {
    this.eventMap.clear();
  }
  /*  */
  dispose(): void {
    this.config = null;
    this.node.destroy({
      children: true,
      texture: true,
      textureSource: true,
      context: true,
      style: true,
    });
    this.eventMap.clear();
  }
}
