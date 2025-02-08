import { CommonComponents } from "@/core";

export default class Source extends CommonComponents {
  public override defaultConfig = {
    Label: "源",
    Sprite: "./images/source/icon_source_000.png",
  };
  constructor(options) {
    super(options);
  }
  protected override onLoad() {
    super.onLoad();
  }
  protected override onStart() {}
  override initVue(config: any) {}
}
