import * as PIXI from 'pixi.js';
import TextBox from './TextBox';

export default class TextBoxContainer {
    private readonly fontSize: number = 14;
    private app: PIXI.Application;
    private titleStyle: PIXI.TextStyle;
    private textBoxValue: number;
    private titleValue: string;
    public textBoxContainer: any;
    public title: PIXI.Text;
    public textBox: TextBox;

    constructor(app: PIXI.Application, text: string, value: number) {
      this.app = app;
      this.textBoxValue = value;
      this.titleValue = text;

      this.init();
      this.renderTextBox();

    }

    init() {
      this.titleStyle = new PIXI.TextStyle({
        fontFamily: 'Questrial',
        fontSize: this.fontSize,
        fill: '#cec9a6',
        fontWeight: 'bolder'
      });
    }

    renderTextBox() {
      this.textBox = new TextBox(this.app, this.textBoxValue);
      this.title = new PIXI.Text(this.titleValue, this.titleStyle);
      this.title.x = this.textBox.container.width/2;
      this.title.anchor.x = 0.5;
      this.textBox.container.y = this.fontSize + 3;

      this.textBoxContainer = new PIXI.Container;
      this.textBoxContainer.addChild(this.title);
      this.textBoxContainer.addChild(this.textBox.container);
      this.textBoxContainer['heightAdjustment'] = 0;
      this.textBoxContainer['widthAdjustment'] = 0;
    }
}
