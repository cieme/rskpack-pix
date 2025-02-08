import { CommonComponents, genLabel } from "@/core";

export default class Source extends CommonComponents {
  public override defaultConfig = {
    Label: "源",
    Sprite: "./images/source/icon_source_000.png",
  };
  constructor(options) {
    super(options);
    console.log(this.config);
  }
  protected override onLoad() {
    console.log(this.uniqueId);
  }
  protected override onStart() {
    console.log("开始");
  }
  override initVue(config: any) {}
}
