import * as PIXI from 'pixi.js';

export default class Decrement {
    public readonly decrementSprite: PIXI.Sprite;
    private readonly onClick: () => void;
    private readonly decrementTexture: PIXI.Texture;

    constructor(app: PIXI.Application, onClick: () => void) {
        this.onClick = onClick;
        this.decrementTexture = app.loader.resources!.ui.textures!['minus_credit.png'];
        this.decrementSprite = new PIXI.Sprite(this.decrementTexture);
        this.init();
    }

    private init() {
        this.decrementSprite.interactive = true;
        this.decrementSprite.buttonMode = true;
        this.decrementSprite.addListener('pointerdown', (ev) => {
            ev.stopPropagation();
            this.onClick();
        });
    }
}
