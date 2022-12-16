import * as PIXI from 'pixi.js';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class Gems {
  private app: PIXI.Application;
  private gemBroken: (value: number) => void;
  private readonly idleTextures: Array<PIXI.Texture> = [];
  private readonly breakTextures: Array<PIXI.Texture> = [];
  private isBroken: boolean = false;
  private gemValue: number;
  private gemColor: string;
  public gemValueText: PIXI.Text;
  public gemsAnimation: PIXI.AnimatedSprite;

    constructor(app: PIXI.Application, gemColor: string = 'blue', gemValue: number = 0, gemBroken: (val: number) => void) {
        this.gemBroken = gemBroken;
        this.app = app;
        this.gemValue = gemValue;
        this.gemColor = gemColor;
        console.log('gemvalue', gemValue);

        let gemIdleTexture = `${gemColor}_gem_idle`;
        for(let img in app.loader.resources![gemIdleTexture].textures){
          const texture = PIXI.Texture.from(img);
          this.idleTextures.push(texture);
        }

        let gemBreakingTexture = `${gemColor}_gem_breaking`;
        for(let img in app.loader.resources![gemBreakingTexture].textures){
          const texture = PIXI.Texture.from(img);
          this.breakTextures.push(texture);
        }
        
        this.init();
    }

    private init() {
      this.createGem();
      this.createGemValueText();
    }

    private createGem() {
      this.gemsAnimation = new PIXI.AnimatedSprite(this.idleTextures);
      this.gemsAnimation.animationSpeed = 0.4;
      this.gemsAnimation.play();
      this.gemsAnimation.interactive = true;
      this.gemsAnimation.buttonMode = true;
      this.gemsAnimation.addListener('pointerdown', this.onClick.bind(this));
    }

    private createGemValueText() {
      const style = new PIXI.TextStyle({
        fontFamily: 'Libre Franklin',
        fontSize: 50,
        fill: this.gemColor,
        stroke: "#00000080",
        strokeThickness: 5,
        fontWeight: '900'
      })

      this.gemValueText = new PIXI.Text(`+${this.gemValue}`, style);
    }

    onClick() {
      if(!this.isBroken){
        this.isBroken = true; 
        this.gemsAnimation.textures = this.breakTextures;
        this.gemsAnimation.anchor.set(0.15, 0.25);
        this.gemsAnimation.animationSpeed = 0.4;
        this.gemsAnimation.loop = false;
        this.gemsAnimation.play();

        this.gemValueText.alpha = 1;
        gsap.to(this.gemValueText, {
          alpha: 0,
          y: - 150,
          duration: 2,
          repeat: 0,
        })

        this.gemBroken(this.gemValue);
      }
    }
}
