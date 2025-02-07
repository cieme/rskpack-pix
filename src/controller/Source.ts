import { CommonComponents, genLabel } from "@/core";

export default class Source extends CommonComponents {
  public options = {
    Label: "源",
    Sprite: "./images/source/icon_source_000.png",
  };
  constructor(options) {
    super(options);
    console.log(this.config);
  }
  protected override onStart() {
    console.log("开始");
  }
  protected override onLoad() {
    this.updateLabel(this.options.Label);
    console.log(this.uniqueId);
  }
  override initVue(config: any) {}
}
