import * as PIXI from 'pixi.js';

export default class Double {
    public readonly doubleSprite: PIXI.Sprite;
    private readonly onClick: () => void;
    private readonly doubleTexture: PIXI.Texture;
    private readonly doubleActiveTexture: PIXI.Texture;

    constructor(app: PIXI.Application, onClick: () => void) {
        this.onClick = onClick;
        this.doubleTexture = app.loader.resources!.ui.textures!['double.png'];
        this.doubleActiveTexture = app.loader.resources!.ui.textures!['double_active.png'];
        this.doubleSprite = new PIXI.Sprite(this.doubleTexture);
        this.init();
    }

    private init() {
        this.doubleSprite.interactive = true;
        this.doubleSprite.buttonMode = true;
        this.doubleSprite.scale.set(0.7);
        this.doubleSprite.addListener('pointerdown', this.onClick);
    }

    toggleButtonState(isActive: boolean = true) {
      this.doubleSprite.interactive = isActive;
      this.doubleSprite.texture = this.doubleTexture;
      if(!isActive)
        this.doubleSprite.texture = this.doubleActiveTexture;
    }
}
