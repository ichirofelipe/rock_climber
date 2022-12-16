import * as PIXI from 'pixi.js';

export default class PersonIdle {
    public readonly personAnimate: PIXI.AnimatedSprite;
    private readonly texture: PIXI.Texture;
    private readonly personTextures: Array<PIXI.Texture> = [];

    constructor(app: PIXI.Application) {
        for(let img in app.loader.resources!.pers_anim.textures){
          this.texture = PIXI.Texture.from(img);
          this.personTextures.push(this.texture);
        }  
      
        this.personAnimate = new PIXI.AnimatedSprite(this.personTextures);
        this.personAnimate.scale.set(0.7);
        this.personAnimate.x = app.screen.width;
        this.personAnimate.y = app.screen.height;
        this.personAnimate.anchor.x = 1.1;
        this.personAnimate.anchor.y = 1.2;
        this.personAnimate.animationSpeed = 0.4;
        this.personAnimate.play();
    }
}
