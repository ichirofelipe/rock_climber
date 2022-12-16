import * as PIXI from 'pixi.js';

export default class BetOne {
    public readonly betOneSprite: PIXI.Sprite;
    private readonly onClick: () => void;
    private readonly betOneTexture: PIXI.Texture;
    private readonly betOneActiveTexture: PIXI.Texture;

    constructor(app: PIXI.Application, onClick: () => void) {
        this.onClick = onClick;
        this.betOneTexture = app.loader.resources!.ui.textures!['betone.png'];
        this.betOneActiveTexture = app.loader.resources!.ui.textures!['betone_active.png'];
        this.betOneSprite = new PIXI.Sprite(this.betOneTexture);
        this.init();
    }

    private init() {
        this.betOneSprite.interactive = true;
        this.betOneSprite.buttonMode = true;
        this.betOneSprite.scale.set(0.7);
        this.betOneSprite.addListener('pointerdown', this.onClick);
    }

    toggleButtonState(isActive: boolean = true) {
        this.betOneSprite.interactive = isActive;
        this.betOneSprite.texture = this.betOneTexture;
        if(!isActive)
          this.betOneSprite.texture = this.betOneActiveTexture;
    }
}
