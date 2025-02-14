import { Graphics } from "pixi.js";

import Big from "big.js";
import { Vector3 as Vec3, Vector3 } from "three";
import { Components } from "@/core";
import { config } from "./trackData";

export default class Track extends Components {
  public defaultConfig = {
    Label: "轨道",
    Sprite: "./images/source/icon_source_000.png",
  };
  graphics: Graphics;
  constructor() {
    super({});
    this.createGraphics();
  }
  protected override init() {
    this.node.label = this.defaultConfig.Label;
  }
  createGraphics() {
    const graphics = new Graphics();
    this.graphics = graphics;
    graphics.setStrokeStyle({
      width: 2,
      color: 0x407cf4,
      cap: "round",
      join: "round",
    });
    this.draw();
    graphics.stroke();
    /*  */
    this.node.addChild(graphics);
    graphics.interactive = true;

    graphics.on("click", (e) => {
      this.graphics.strokeStyle.color = 0xf56c6c;
      this.graphics.stroke();
      // const local = graphics.toLocal(e.global);
      // console.log(this.isTouchOnTrack(new Vec3(local.x, local.y, 0)));
    });
  }
  draw(active = false) {
    this.graphics.clear();
    this.graphics.strokeStyle.width = 10;

    if (config.pointList.length == 0) {
      return;
    }
    config.pointList.forEach((element) => {
      element.position.y = -element.position.y;
      if (element.center) {
        element.center.y = -element.center.y;
      }
    });

    for (let index = 1; index < config.pointList.length; ++index) {
      const begin = config.pointList[index - 1];
      const end = config.pointList[index];
      if (end.radian != null && end.radius != null && index != 0) {
        // 这里画弧形
        this.drawArc(begin, end);
      } else {
        this.drawLine(begin, end);
      }
    }

    const lastPoint = config.pointList[config.pointList.length - 1];
  }
  drawLine(begin, end) {
    this.graphics.moveTo(
      MeterToUnit(begin.position.x),
      MeterToUnit(begin.position.y),
    );
    this.graphics.lineTo(
      MeterToUnit(end.position.x),
      MeterToUnit(end.position.y),
    );
  }

  /**
   * 画弧线-- 至少要三个点，否则有几率画不出弧线
   * @param prePoint  开始前一个点味了计算方向
   * @param begin     起点
   * @param end       终点
   */
  drawArc(begin, end) {
    const startAngle = this.getAngle(
      Vec3MeterToUnit(begin.position),
      end.center,
    );
    const endAngle = startAngle - (end.radian / 180) * Math.PI;

    this.graphics.arc(
      end.center.x,
      end.center.y,
      MeterToUnit(end.radius),
      Math.PI - startAngle,
      Math.PI - endAngle,
      end.radian > 0 ? false : true, // 反过来写
    );
  }
  getAngle(start, center) {
    const x = start.x - center.x;
    const y = start.y - center.y;
    return Math.atan2(y, x);
  }
  isTouchOnTrack(pos: Vec3) {
    const configLineWidth = Number(config?.lineWidth || 0.3);

    for (let index = 0; index + 1 < config.pointList.length; ++index) {
      let start = config.pointList[index];
      let end = config.pointList[index + 1];

      let distance = this.touchDistance(start, end, pos);

      let max = MeterToUnit(configLineWidth) / 2;
      if (max < 8) {
        max = 8;
      }
      if (distance > 0 && distance <= max) {
        return true;
      }
    }

    return false;
  }
  touchDistance(start, end, pos: Vec3) {
    if (end.center == null)
      return this.pointToSegmentDistance(
        Vec3MeterToUnit(start.position),
        Vec3MeterToUnit(end.position),
        pos,
      );

    return this.pointToArcDistance(
      Vec3MeterToUnit(start.position),
      Vec3MeterToUnit(end.position),
      new Vector3(end.center.x, end.center.y, 0),
      pos,
      end.radian,
    );
  }
  /**
   * 计算点与线段上所有点的最短距离
   * @param {cc.Vec3} start - 线段的起点
   * @param {cc.Vec3} end - 线段的终点
   * @param {cc.Vec3} pos - 要计算距离的点
   * @returns {number} - 点与线段上所有点的最短距离
   */
  pointToSegmentDistance(start: Vec3, end: Vec3, pos: Vec3) {
    // 计算线段的向量 AB 和 AP
    const AB = end.clone();
    const AP = pos.clone();
    AB.sub(start);
    AP.sub(start);

    // 计算 AB 的平方（用于投影）
    const AB2 = AB.dot(AB);

    // 处理特殊情况：如果线段长度为零（即起点和终点重合）
    if (AB2 === 0) {
      return pos.distanceTo(start); // 返回点到起点的距离
    }

    // 计算投影比例 t
    const t = AP.dot(AB) / AB2;

    let projection = new Vec3();

    if (t < 0) {
      // 投影点在起点左侧，返回点到起点的距离
      projection = start;
    } else if (t > 1) {
      // 投影点在终点右侧，返回点到终点的距离
      projection = end;
    } else {
      // 投影点在线段上
      let normal = AB.clone();
      normal.normalize();

      projection = start.add(normal.multiplyScalar(start.distanceTo(end) * t));
    }

    // 计算并返回点 pos 到投影点的距离
    return pos.distanceTo(projection);
  }

  /**
   * 计算点到线段距离
   * 如果在弧线内则计算点到圆心距离与半径差异
   * 股弱在弧线外，计算点与起点和终点的最小距离
   * @param start
   * @param end
   * @param pos
   * @returns
   */
  pointToArcDistance(
    start: Vec3,
    end: Vec3,
    center: Vec3,
    pos: Vec3,
    radian: number,
  ) {
    let startAngle = this.getAngle(start, center);
    let endAngle = startAngle - (radian / 180) * Math.PI;

    let posAngle = this.getAngle(pos, center);

    if (endAngle < -Math.PI) {
      if (posAngle > startAngle) {
        posAngle = posAngle - 2 * Math.PI;
      }
    }

    if (endAngle > Math.PI) {
      if (posAngle < startAngle) {
        posAngle = posAngle + 2 * Math.PI;
      }
    }

    if (startAngle > endAngle) {
      if (posAngle >= endAngle && posAngle <= startAngle) {
        return Math.abs(center.distanceTo(pos) - end.distanceTo(center));
      } else {
        return Math.min(pos.distanceTo(start), pos.distanceTo(end));
      }
    } else {
      if (posAngle >= startAngle && posAngle <= endAngle) {
        return Math.abs(center.distanceTo(pos) - end.distanceTo(center));
      } else {
        return Math.min(pos.distanceTo(start), pos.distanceTo(end));
      }
    }
  }
}
export const ratio: number = 20;
function MeterToUnit(num: number) {
  return new Big(num).mul(new Big(ratio)).toNumber();
}
export function Vec3MeterToUnit(position: Vec3) {
  return new Vec3(
    MeterToUnit(position.x),
    MeterToUnit(position.y),
    MeterToUnit(position.z),
  );
}
