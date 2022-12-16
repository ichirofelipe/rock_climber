import * as PIXI from 'pixi.js';

export default class Fire {
    private readonly fireTextures: Array<PIXI.Texture> = [];
    public fireAnimate: PIXI.AnimatedSprite;
    private texture: PIXI.Texture;
    private app: PIXI.Application;

    constructor(app: PIXI.Application) {
        this.app = app;
        
        this.init();
        this.fireSettings();
    }

    init() {
      for(let img in this.app.loader.resources!.fire_anim.textures){
        this.texture = PIXI.Texture.from(img);
        this.fireTextures.push(this.texture);
      } 
      
      this.fireAnimate = new PIXI.AnimatedSprite(this.fireTextures);
    }

    fireSettings() {
      this.fireAnimate.scale.set(0.7);
      this.fireAnimate.x = this.app.screen.width / 10;
      this.fireAnimate.y = this.app.screen.height / 1.6;
      this.fireAnimate.animationSpeed = 0.4;
      this.fireAnimate.play();
    }
}
