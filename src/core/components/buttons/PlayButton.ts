import * as PIXI from 'pixi.js';

export default class PlayButton {
    public readonly sprite: PIXI.Sprite;
    private readonly onClick: () => void;
    private readonly activeTexture: PIXI.Texture;
    private readonly disabledTexture: PIXI.Texture;

    constructor(app: PIXI.Application, onClick: () => void) {
        this.onClick = onClick;
        this.activeTexture = app.loader.resources!.ui.textures!['start_btn.png'];
        this.disabledTexture = app.loader.resources!.ui.textures!['start_active_btn.png'];
        this.sprite = new PIXI.Sprite(this.activeTexture);
        this.init();
    }

    setEnabled() {
        this.sprite.texture = this.activeTexture;
        this.sprite.interactive = true;
    }

    setDisabled() {
        this.sprite.texture = this.disabledTexture;
        this.sprite.interactive = false;
    }

    private init() {
        this.sprite.anchor.set(0.85, 0.95);
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.scale.set(0.75);
        this.sprite.addListener('pointerdown', this.onClick);
    }
}
