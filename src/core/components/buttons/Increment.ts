import * as PIXI from 'pixi.js';

export default class Increment {
    public readonly incrementSprite: PIXI.Sprite;
    private readonly onClick: () => void;
    private readonly incrementTexture: PIXI.Texture;

    constructor(app: PIXI.Application, onClick: () => void) {
        this.onClick = onClick;
        this.incrementTexture = app.loader.resources!.ui.textures!['buy_credit.png'];
        this.incrementSprite = new PIXI.Sprite(this.incrementTexture);
        this.init();
    }

    private init() {
        this.incrementSprite.interactive = true;
        this.incrementSprite.buttonMode = true;
        this.incrementSprite.addListener('pointerdown', (ev) => {
            ev.stopPropagation();
            this.onClick();
        });
    }
}
