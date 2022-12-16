import * as PIXI from 'pixi.js';

export default class AutoSpin {
    public readonly spriteButton: PIXI.Sprite;
    public readonly container: PIXI.Container;
    private readonly onClick: () => void;
    private readonly activeTexture: PIXI.Texture;
    private readonly disabledTexture: PIXI.Texture;
    public isSpinning: Boolean;

    constructor(app: PIXI.Application, onClick: () => void) {
        this.onClick = onClick;
        this.container = new PIXI.Container;
        this.activeTexture = app.loader.resources!.ui.textures!['auto_spin.png'];
        this.disabledTexture = app.loader.resources!.ui.textures!['auto_spin_active.png'];
        this.spriteButton = new PIXI.Sprite(this.activeTexture);
        this.init();
    }

    setActive() {
      this.spriteButton.texture = this.activeTexture;
      this.spriteButton.interactive = true;
      this.isSpinning = false;
    }

    setInactive() {
      this.spriteButton.texture = this.disabledTexture;
      this.spriteButton.interactive = true;
      this.isSpinning = true;
    }

    setDisabled() {
      this.spriteButton.interactive = false;
    }
    
    setEnabled() {
      this.spriteButton.interactive = true;
    }

    private init() {
      this.spriteButton.anchor.set(0.15, 0.95);
      this.spriteButton.interactive = true;
      this.spriteButton.buttonMode = true;
      this.spriteButton.scale.set(0.75);
      this.spriteButton.x = 0;
      this.spriteButton.addListener('pointerdown', this.onClick);

      this.container.addChild(this.spriteButton);
    }
}
