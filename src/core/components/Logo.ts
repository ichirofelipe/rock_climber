import * as PIXI from 'pixi.js';

export default class Logo {
    private readonly texture: PIXI.Texture;
    private readonly textures: Array<PIXI.Texture> = [];
    public readonly animatedSprite: PIXI.AnimatedSprite;

    constructor(app: PIXI.Application) {
        for(let img in app.loader.resources!.logo_anim.textures){
          this.texture = PIXI.Texture.from(img);
          this.textures.push(this.texture);
        }

        this.animatedSprite = new PIXI.AnimatedSprite(this.textures);
        this.animatedSprite.scale.set(0.60, 0.60);
        this.animatedSprite.x = app.screen.width / 2;
        this.animatedSprite.anchor.x = 0.5;
        this.animatedSprite.anchor.y = 0.05;
        this.animatedSprite.play();
        this.animatedSprite.animationSpeed = 0.4;
    }
    
}
