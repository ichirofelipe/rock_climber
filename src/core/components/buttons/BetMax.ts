import * as PIXI from 'pixi.js';

export default class BetMax {
    public readonly betMaxSprite: PIXI.Sprite;
    private readonly onClick: () => void;
    private readonly betMaxTexture: PIXI.Texture;
    private readonly betMaxActiveTexture: PIXI.Texture;

    constructor(app: PIXI.Application, onClick: () => void) {
        this.onClick = onClick;
        this.betMaxTexture = app.loader.resources!.ui.textures!['betmax.png'];
        this.betMaxActiveTexture = app.loader.resources!.ui.textures!['betmax_active.png'];
        this.betMaxSprite = new PIXI.Sprite(this.betMaxTexture);
        this.init();
    }

    private init() {
        this.betMaxSprite.interactive = true;
        this.betMaxSprite.buttonMode = true;
        this.betMaxSprite.scale.set(0.7);
        this.betMaxSprite.addListener('pointerdown', this.onClick);
    }

    toggleButtonState(isActive: boolean = true) {
      this.betMaxSprite.interactive = isActive;
      this.betMaxSprite.texture = this.betMaxTexture;
      if(!isActive)
        this.betMaxSprite.texture = this.betMaxActiveTexture;
    }
}
