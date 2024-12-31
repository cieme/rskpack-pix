import { Assets, Texture, Sprite } from "pixi.js";

/**
 * 加载精灵资源
 * @author cieme
 * @date 2024-12-17
 * @param {any} TextureUrl:string
 * @returns {any}
 */
export async function loadSpriteByTexture(
  TextureUrl: string,
  i,
): Promise<Sprite> {
  const bunnyTexture = await Assets.load<Texture>(TextureUrl, () => {});
  const sprite = new Sprite({
    texture: bunnyTexture,
  });
  return sprite;
}
