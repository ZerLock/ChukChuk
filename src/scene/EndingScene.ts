import * as ex from "excalibur";
import { Images, credtisSpriteSheet } from "../resources";

const font = [
  "Impact",
  "Arial",
  "Helvetica",
  "sans-serif",
  "monospace",
  "serif",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Georgia",
  "Palatino",
  "Garamond",
  "Bookman",
  "Comic Sans MS",
  "Trebuchet MS",
];

export class EndingScene extends ex.Scene {
  constructor(halfDrawWidth: number, halfDrawHeigh: number) {
    super();
  }

  public onInitialize(engine: ex.Engine): void {
    // add a text saying "merci"
    const text = new ex.Text({
      text: "Thank you for playing :D !",
      font: new ex.Font({ size: 60, family: "Arial" }),
      color: ex.Color.White,
    });
    const thanks = new ex.Actor({
      pos: ex.vec(window.innerWidth / 2, window.innerHeight / 2 - 300),
    });
    thanks.graphics.use(text);
    // clock to change text color
    const clock = new ex.Timer({
      interval: 700,
      fcn: () => {
        text.color = ex.Color.fromRGB(
          Math.floor(Math.random() * 255),
          Math.floor(Math.random() * 255),
          Math.floor(Math.random() * 255)
        );
        text.font = new ex.Font({
          ...text.font,
          family: font[Math.floor(Math.random() * font.length)],
        });
      },
      repeats: true,
    });

    this.add(clock);
    clock.start();
    this.loadSky();
    this.add(thanks);
    this.createActorAnimations(
      credtisSpriteSheet.baptiste,
      4,
      200,
      window.innerWidth / 2 - 400,
      window.innerHeight / 2 + 200
    );
    this.createActorAnimations(
      credtisSpriteSheet.joshua,
      4,
      200,
      window.innerWidth / 2 - 200,
      window.innerHeight / 2 + 200
    );
    this.createActorAnimations(
      credtisSpriteSheet.leo,
      4,
      200,
      window.innerWidth / 2,
      window.innerHeight / 2 + 200
    );
    this.createActorAnimations(
      credtisSpriteSheet.mathias,
      4,
      200,
      window.innerWidth / 2 + 200,
      window.innerHeight / 2 + 200
    );
    this.createActorAnimations(
      credtisSpriteSheet.paul,
      4,
      200,
      window.innerWidth / 2 + 400,
      window.innerHeight / 2 + 200
    );
    this.createActorAnimations(
      credtisSpriteSheet.firework,
      40,
      100,
      window.innerWidth / 2 + 600,
      window.innerHeight / 2 - 250
    );
    this.createActorAnimations(
      credtisSpriteSheet.firework,
      40,
      100,
      window.innerWidth / 2 - 600,
      window.innerHeight / 2 - 250
    );
  }
  private loadSky() {
    for (let i = -1; i < 3; i++) {
      const width = (window.innerHeight * 16) / 9;

      const skySide = new ex.Actor({
        pos: ex.vec(i * width, 0),
        width: window.innerWidth,
        height: window.innerHeight,
      });

      const skySideSprite = Images.skySide.toSprite();
      skySideSprite.width = width;
      skySideSprite.height = window.innerHeight;

      skySide.addComponent(new ex.ParallaxComponent(ex.vec(0.05, 0)));
      skySide.graphics.add("sky", skySideSprite);
      skySide.graphics.use("sky");

      this.add(skySide);
    }
  }
  public createArrayNumber = (length: number) => {
    return Array.from({ length }, (_, i) => i);
  };
  public createActorAnimations(
    spriteSheet: ex.SpriteSheet,
    length: number,
    time: number,
    posX: number,
    posY: number,
    scale?: boolean
  ) {
    const anime = ex.Animation.fromSpriteSheet(
      spriteSheet,
      this.createArrayNumber(length),
      time
    );
    const generikActor = new ex.Actor({
      pos: ex.vec(posX, posY),
      scale: scale ? ex.vec(1, 1) : ex.vec(3, 3),
    });
    generikActor.graphics.use(anime);
    this.add(generikActor);
  }
}
