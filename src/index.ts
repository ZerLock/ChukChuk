import * as ex from 'excalibur';
import { MainGame } from "./class/game";
import { UpperScene } from "./scene/UpperScene";
import map from "./maps/map1.json";
import { getSpritesToDisplay, Views } from "./utils/map";

const JoshuLayers = getSpritesToDisplay(map, Views.Upper);

console.log(JoshuLayers);

import { loader } from './resources';

loader.playButtonText = 'Start ChukChuk';

MainGame.start(loader).then(() => {});