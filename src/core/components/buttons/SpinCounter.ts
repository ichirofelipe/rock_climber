import * as PIXI from 'pixi.js';
import Increment from './Increment';
import Decrement from './Decrement';

export default class SpinCounter {
    private app: PIXI.Application;
    private spinCounterTexture: PIXI.Texture;
    public increment: Increment;
    public decrement: Decrement;
    public spriteSpinCounter: PIXI.Sprite;
    public spinOptions: Array<number> = [50, 75, 100, 250, 500, 1000];
    public isSpinning: Boolean;
    public toSpinIndex: number = 0;
    public currentSpinCount: number = 0;
    public counter: PIXI.Text;

    constructor(app: PIXI.Application) {
        this.app = app;

        this.init();
        this.counterSettings();
        this.incrementSettings();
        this.decrementSettings();
    }

    updateTextCounter() {
      this.counter.text = this.spinOptions[this.toSpinIndex] - this.currentSpinCount;

      let fontSize = 30;
      if(this.spinOptions[this.toSpinIndex] > 99)
        fontSize = 22;

      this.counter.style.fontSize = fontSize;
    }

    private init() {
      this.spinCounterTexture = this.app.loader.resources!.ui.textures!['spin_numbers.png'];
      this.spriteSpinCounter = new PIXI.Sprite(this.spinCounterTexture);

      let fontSize = 30;
      if(this.spinOptions[this.toSpinIndex] > 99)
        fontSize = 22;

      const style = new PIXI.TextStyle({
        fontFamily: 'Questrial',
        fontSize: fontSize,
        fill: '#FFFFFF',
        fontWeight: 'bolder'
      });
      this.counter = new PIXI.Text(this.spinOptions[this.toSpinIndex] - this.currentSpinCount, style);

      // const rect = new PIXI.Graphics();
      // rect.beginFill(0xffffff)
      // .drawRect(0,0,this.spriteSpinCounter.width, this.spriteSpinCounter.height)
      // .endFill();
      // this.spriteSpinCounter.addChild(rect);
    }

    private counterSettings() {
      this.counter.anchor.set(0.5);
      this.counter.x = this.spriteSpinCounter.width/2;
      this.counter.y = this.spriteSpinCounter.height/2;
      
      this.spriteSpinCounter.addChild(this.counter);
    }

    incrementSettings() {
      this.increment = new Increment(this.app, this.incrementSpin.bind(this));
      this.increment.incrementSprite.scale.set(0.35);
      this.increment.incrementSprite.y = - 10;
      this.increment.incrementSprite.x = (this.spriteSpinCounter.width/2) + 3;
      this.spriteSpinCounter.addChild(this.increment.incrementSprite);
    }

    decrementSettings() {
      this.decrement = new Decrement(this.app, this.decrementSpin.bind(this));
      this.decrement.decrementSprite.scale.set(0.35);
      this.decrement.decrementSprite.y = - 4;
      this.decrement.decrementSprite.x = (this.decrement.decrementSprite.width / 2);
      this.spriteSpinCounter.addChild(this.decrement.decrementSprite);
    }

    private incrementSpin() {
      console.log('increment');
      if(this.toSpinIndex < (this.spinOptions.length - 1))
        this.toSpinIndex++;

      this.updateTextCounter();
    }

    private decrementSpin() {
      if(this.toSpinIndex > 0)
        this.toSpinIndex--;

      this.updateTextCounter();
    }
}
