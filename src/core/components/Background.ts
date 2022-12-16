import * as PIXI from 'pixi.js';

export default class Background {
    public sprite: PIXI.Container;
    private texture: PIXI.Texture;
    private app: PIXI.Application;

    constructor(app: PIXI.Application) {
        this.app = app;
        
        this.init();
        this.backgroundSettings();
    }

    init() {
        this.texture = this.app.loader.resources!.main.textures!['back.png'];
        this.sprite = new PIXI.Sprite(this.texture);
    }

    backgroundSettings() {
        this.sprite.width = this.app.screen.width;
        this.sprite.height = this.app.screen.height;
    }
}
