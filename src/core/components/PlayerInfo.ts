import * as PIXI from 'pixi.js';
import TextBoxContainer from './textbox/TextBoxContainer';
import Decrement from './buttons/Decrement';
import Increment from './buttons/Increment';

export default class PlayerInfo {
    private texture: PIXI.Texture;
    private readonly eventDisplayTextures: Array<PIXI.Texture> = [];
    private app: PIXI.Application;
    private containerWidth: number;
    private currentBalance: TextBoxContainer;
    private totalBet: TextBoxContainer;
    private currentBet: TextBoxContainer;
    private notifText: string = 'Welcome!';
    private notifTitleStyle: PIXI.TextStyle;
    public container: PIXI.Container;
    public eventDisplay: PIXI.AnimatedSprite;
    public currentBalanceVal: number = 1000;
    public totalBetVal: number = 0;
    public currentBetVal: number = 1;
    public decrement: Decrement;
    public increment: Increment;
    public lines: number = 9;
    public notif: PIXI.Text;

    constructor(app: PIXI.Application, width: number) {
      this.app = app;
      this.containerWidth = width;

      

      this.init();
      this.currentBalanceSettings();
      this.totalBetSettings();
      this.currentBetSettings();
      this.decrementSettings();
      this.incrementSettings();     
      this.eventDisplaySettings(); 
      this.notifTextSettings();

      // const rect = new PIXI.Graphics();
      // rect.beginFill(0x555555)
      // .drawRect(0, 0,width*0.6, height)
      // .endFill();
      // this.container.addChild(rect);
      this.container.addChild(this.eventDisplay);
      this.container.addChild(this.currentBalance.textBoxContainer);
      this.container.addChild(this.totalBet.textBoxContainer);
      this.container.addChild(this.currentBet.textBoxContainer);
      
      this.updateTotalBet();
    }

    init() {
      this.container = new PIXI.Container();
      this.container.x = (this.containerWidth*0.6)/3;
      this.container.y = 0;

      for(let img in this.app.loader.resources!.tablo_anim.textures){
        this.texture = PIXI.Texture.from(img);
        this.eventDisplayTextures.push(this.texture);
      }

      this.eventDisplay = new PIXI.AnimatedSprite(this.eventDisplayTextures);

      this.notifTitleStyle = new PIXI.TextStyle({
        fontFamily: 'Questrial',
        fontSize: 28,
        fill: '#4aacdd',
        fontWeight: 'bolder'
      });
    }

    currentBalanceSettings() {
      this.currentBalance = new TextBoxContainer(this.app, 'CURRENT BALANCE', this.currentBalanceVal);
      this.currentBalance.textBoxContainer.position.set(10, 5);
    }

    totalBetSettings() {
      this.totalBet = new TextBoxContainer(this.app, 'TOTAL BET', this.totalBetVal);
      this.totalBet.textBoxContainer.position.set(this.containerWidth*0.6, 5);
      this.totalBet.textBoxContainer.pivot.x = this.totalBet.textBoxContainer.width + 10;
    }

    currentBetSettings() {
      this.currentBet = new TextBoxContainer(this.app, 'CURRENT BET', this.currentBetVal);
      this.currentBet.textBoxContainer.position.set((this.containerWidth*0.6) / 2, 15);
      this.currentBet.textBoxContainer.pivot.x = this.currentBet.textBoxContainer.width / 2;
      this.currentBet.textBoxContainer.pivot.y = - this.currentBet.textBoxContainer.height;
    }

    decrementSettings() {
      this.decrement = new Decrement(this.app, this.decrementBet.bind(this));
      this.decrement.decrementSprite.anchor.x = 0.3;
      this.decrement.decrementSprite.anchor.y = 1;
      this.decrement.decrementSprite.y = this.currentBet.textBoxContainer.height + 5;
      this.currentBet.textBoxContainer.addChild(this.decrement.decrementSprite);
    }

    incrementSettings() {
      this.increment = new Increment(this.app, this.incrementBet.bind(this));
      this.increment.incrementSprite.anchor.x = 1;
      this.increment.incrementSprite.anchor.y = 1;
      this.increment.incrementSprite.y = this.currentBet.textBoxContainer.height + 10;
      this.increment.incrementSprite.x = this.currentBet.textBoxContainer.width;
      this.currentBet.textBoxContainer.addChild(this.increment.incrementSprite);
    }

    eventDisplaySettings() {
      this.eventDisplay.anchor.y = 0.35;
      this.eventDisplay.scale.set(0.7);
      this.eventDisplay.x = ((this.containerWidth*0.6) / 2) - ((this.eventDisplay.width / 2));
      this.eventDisplay.y = 0;
      this.eventDisplay.animationSpeed = 0.025;
      this.eventDisplay.play();
    }

    notifTextSettings() {
      this.notif = new PIXI.Text(this.notifText, this.notifTitleStyle);
      this.eventDisplay.addChild(this.notif);
      this.notif.x = ((this.eventDisplay.width / 0.7) / 2);
      this.notif.anchor.x = 0.5;
    }
    

    //PLAYER INFO FUNCTIONS

    decrementBet() {
      if(this.currentBetVal > 1){
        this.currentBetVal -= 0.5;
        this.updateCurrentBet();
        this.updateTotalBet();
      }
    }

    incrementBet() {
      if(this.currentBetVal < 10){
        this.currentBetVal += 0.5;
        this.updateCurrentBet();
        this.updateTotalBet();
      }
    }

    updateCurrentBet() {
      this.currentBet.textBox.text.text = this.currentBetVal;
    }

    updateTotalBet() {
      this.totalBetVal = this.lines * this.currentBetVal;
      this.totalBet.textBox.text.text = this.totalBetVal;
    }

    updateBalance() {
      this.currentBalance.textBox.text.text = this.currentBalanceVal;
    }

    checkBalance(sufficientBalance:(isSufficient: boolean) => void) {
      if(this.totalBetVal > this.currentBalanceVal){
        alert('Insufficient Balance!!');
        sufficientBalance(false);
        return
      }
      this.currentBalanceVal -= this.totalBetVal;
      this.updateBalance();
      sufficientBalance(true);
    }

    changeLinesValue() {
      this.lines += 2;
      if(this.lines > 9)
        this.lines = 1;

      this.updateTotalBet();
    }
}
