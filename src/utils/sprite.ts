import spriteDict from "../spriteDict.json";
import { Views } from "./map";

interface ISpriteData {
  x: number;
  y: number;
  collision: boolean;
  agressive: boolean;
  upper: string;
}

interface ISpriteDict {
  [key: string]: ISpriteData;
}

export const getSprite = (id: string, view: Views): ISpriteData => {
  const spriteData = (spriteDict as ISpriteDict)[id] as ISpriteData;
  if (view === Views.Upper) {
    return (spriteDict as ISpriteDict)[spriteData.upper];
  }
  return spriteData;
};
