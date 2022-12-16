import * as PIXI from 'pixi.js';

export default class TextBox {
    private app: PIXI.Application;
    private infoCornerSpriteLeft: PIXI.Sprite;
    private infoCornerSpriteRight: PIXI.Sprite;
    private infoBackgroundSprite: PIXI.Sprite;
    private readonly textBoxHeight: number = 20;
    private readonly textBoxWidth: number = 180;
    private textValue: number;
    private textStyle: PIXI.TextStyle;
    public readonly container: PIXI.Container;
    public text: PIXI.Text;
    public title: PIXI.Text;

    constructor(app: PIXI.Application, value: number) {
      this.app = app;
      this.textValue = value;
      this.init();
      this.infoBoxSettings();
      this.renderTextValue();

      this.container = new PIXI.Container();
      this.container.addChild(this.infoBackgroundSprite);
      this.container.addChild(this.infoCornerSpriteLeft);
      this.container.addChild(this.infoCornerSpriteRight);
      this.container.addChild(this.text);
    }

    init() {
      this.infoBackgroundSprite = new PIXI.Sprite(this.app.loader.resources!.ui.textures!['b2.png']);
      this.infoCornerSpriteLeft = new PIXI.Sprite(this.app.loader.resources!.ui.textures!['b1.png']);
      this.infoCornerSpriteRight = new PIXI.Sprite(this.app.loader.resources!.ui.textures!['b1.png']);

      this.textStyle = new PIXI.TextStyle({
        fontFamily: 'Questrial',
        fontSize: 14,
        fill: '#cec9a6',
      });
    }

    infoBoxSettings() {
      this.infoCornerSpriteLeft.width = this.textBoxWidth*0.15;
      this.infoCornerSpriteLeft.height = this.textBoxHeight;
      this.infoCornerSpriteLeft.x = 0;

      this.infoBackgroundSprite.width = this.textBoxWidth*0.8 + 3;
      this.infoBackgroundSprite.height = this.textBoxHeight;
      this.infoBackgroundSprite.x = this.textBoxWidth*0.1 - 1;
      this.infoBackgroundSprite.y = 0;

      this.infoCornerSpriteRight.width = this.textBoxWidth*0.1;
      this.infoCornerSpriteRight.height = this.textBoxHeight;
      this.infoCornerSpriteRight.x = this.textBoxWidth;
      this.infoCornerSpriteRight.scale.x = -1;
    }

    renderTextValue() {
      this.text = new PIXI.Text(this.textValue, this.textStyle);
      this.text.x = this.textBoxWidth/2;
      this.text.y = this.textBoxHeight/2;
      this.text.anchor.set(0.5);
    }
}
