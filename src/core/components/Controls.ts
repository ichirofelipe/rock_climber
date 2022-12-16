import * as PIXI from 'pixi.js';
import PlayButton from './buttons/PlayButton';
import AutoSpin from './buttons/AutoSpin';
import SpinCounter from './buttons/SpinCounter';
import PlayerInfo from './PlayerInfo';
import Lines from './buttons/Lines';
import BetOne from './buttons/BetOne';
import Double from './buttons/Double';
import BetMax from './buttons/BetMax';
import MegaWin from './MegaWin';
import MiniGame from './MiniGame';
import ReelsContainer from './ReelsContainer';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class Controls {
    private readonly app: PIXI.Application;
    private readonly playBtn: PlayButton;
    private readonly autoSpin: AutoSpin;
    private readonly spinCounter: SpinCounter;
    private playerInfo: PlayerInfo;
    private readonly lines: Lines;
    private readonly betOne: BetOne;
    private readonly double: Double;
    private readonly betMax: BetMax;
    private megaWin: MegaWin;
    private miniGame: MiniGame;
    private readonly reelsContainer: ReelsContainer;
    private winnings: number;
    private showMegaWin: boolean;
    public readonly container: PIXI.Container;
    public conWidth: number;
    public conHeight: number;

    constructor(app: PIXI.Application, reelsContainer: ReelsContainer) {
      this.app = app;
      this.reelsContainer = reelsContainer;

      this.container = new PIXI.Container();
      this.playBtn = new PlayButton(this.app, this.handleStart.bind(this));
      this.autoSpin = new AutoSpin(this.app, this.handleAutoStart.bind(this));
      this.spinCounter = new SpinCounter(this.app);
      this.lines = new Lines(this.app, this.updateLines.bind(this));
      this.betOne = new BetOne(this.app, this.betToMin.bind(this));
      this.double = new Double(this.app, this.betToDouble.bind(this));
      this.betMax = new BetMax(this.app, this.betToMax.bind(this));

      this.init();
      
    }

    init() {
      this.containerSettings();
      this.playBtnSettings();
      this.autoSpinSettings();
      this.spinCounterSettings();
      this.linesSettings();
      this.betOneSettings();
      this.doubleSettings();
      this.betMaxSettings();
    }

    containerSettings() {
      this.conWidth = this.app.screen.width;
      this.conHeight = this.app.screen.height / 3;
      this.container.width = this.conWidth;
      this.container.height = this.conHeight;
      this.container.y = this.app.screen.height - (this.conHeight - 30);
      this.container.scale.set(1);
      this.container.sortableChildren = true;

      // const rect = new PIXI.Graphics();
      // rect.beginFill(0xffffff)
      // .drawRect(0,0,this.conWidth, this.conHeight)
      // .endFill();

      // this.container.addChild(rect);

      this.playerInfo = new PlayerInfo(this.app, this.conWidth);
      this.container.addChild(this.playerInfo.container);
    }

    playBtnSettings() {
      this.playBtn.sprite.x = this.conWidth;
      this.playBtn.sprite.y = this.conHeight;

      this.container.addChild(this.playBtn.sprite);
    }

    autoSpinSettings() {
      this.autoSpin.container.y = this.conHeight;

      this.container.addChild(this.autoSpin.container);
    }

    spinCounterSettings() {
      this.spinCounter.spriteSpinCounter.scale.set(0.8);
      this.spinCounter.spriteSpinCounter.x = ((this.autoSpin.spriteButton.width*0.825) / 2);
      this.spinCounter.spriteSpinCounter.y = - (this.autoSpin.spriteButton.height*1.225 - (this.spinCounter.spriteSpinCounter.height / 2));
      this.spinCounter.spriteSpinCounter.interactive = true;
      this.spinCounter.spriteSpinCounter.buttonMode = false;

      this.autoSpin.container.addChild(this.spinCounter.spriteSpinCounter);
    }

    linesSettings() {
      this.lines.updateActiveLinesArray(this.playerInfo.lines);
      this.lines.linesSprite.y = ((this.conHeight - 30) - 10) - this.lines.linesSprite.height;
      this.lines.linesSprite.x = this.autoSpin.spriteButton.width;

      this.container.addChild(this.lines.linesSprite);
    }

    betOneSettings() {
      this.betOne.betOneSprite.x = this.autoSpin.spriteButton.width + this.betOne.betOneSprite.width + 20;
      this.betOne.betOneSprite.y = ((this.conHeight - 30) - 10) - this.betOne.betOneSprite.height;

      this.container.addChild(this.betOne.betOneSprite);
    }

    doubleSettings() {
      this.double.doubleSprite.y = ((this.conHeight - 30) - 10) - this.double.doubleSprite.height;
      this.double.doubleSprite.x = this.conWidth - (this.playBtn.sprite.width / 0.75) - (this.double.doubleSprite.width / 2) - 20;

      this.container.addChild(this.double.doubleSprite);
    }

    betMaxSettings() {
      this.betMax.betMaxSprite.y = ((this.conHeight - 30) - 10) - this.betMax.betMaxSprite.height;
      this.betMax.betMaxSprite.x = this.conWidth - (this.playBtn.sprite.width / 0.75) - this.double.doubleSprite.width / 2 - this.betMax.betMaxSprite.width - 40;

      this.container.addChild(this.betMax.betMaxSprite);
    }




    //GAME FUNCTIONS

    handleStart() {
      this.autoSpin.setInactive();
      this.autoSpin.setDisabled();
      this.playBtn.setDisabled();
      this.toggleButtonsState(false);
      this.spinStart( () => {
        this.autoSpin.setActive(); 
        this.autoSpin.setEnabled();
        this.playBtn.setEnabled();
        this.toggleButtonsState(true);
      })
    }

    handleAutoStart() {
      if(this.autoSpin.isSpinning){
        this.spinCounter.currentSpinCount = 0;
        this.autoSpin.setActive();
        this.autoSpin.setDisabled();
        this.spinCounter.updateTextCounter();
      } else{
        this.toggleButtonsState(false);
        this.playBtn.setDisabled();
        this.autoSpin.setInactive();
        this.spinCounter.currentSpinCount++;
        this.spinCounter.updateTextCounter();
        this.loop(false);
      }
    }

    handleSpinCount() {
      this.autoSpin.spriteButton.interactive = false;
      console.log('display menu for changing spin count');
      this.autoSpin.spriteButton.interactive = true;
    }

    spinStart(spinAgain: () => void) {

      //CHECK PLAYER BALANCE IF SUFFICIENT
      this.playerInfo.checkBalance((isSufficient: Boolean) => {

        //CONTINUE
        if(isSufficient){
          //REELS SPIN
          this.reelsContainer.spin((pattern: Array<any>) => {
            //CHECK IF HAS WINNING PATTERN
            if(pattern.length > 0)
              this.winEvent(pattern);
              
            //ANIMATE THE WINNING SYMBOLS/ICONS
            this.reelsContainer.animateWinningResult( pattern, () => {
              this.playerInfo.notif.text = '';

              //IF PATTERN IS FOR BONUS GAME
              if (pattern.filter(e => e.combination === 'icon_7').length > 0){

                //CREATE SHOW MINI GAME
                this.miniGame = new MiniGame(this.app, this.playerInfo.totalBetVal, (total: number) => {
                  this.winnings += total;
                  if(total > (this.playerInfo.totalBetVal*5))
                    this.showMegaWin = true;
                  //UPDATE BALANCE, SHOW MEGA ANIMATION, HIDE MINIGAME
                  this.updateToLatestBalance();
                  this.megaAnimation();
                  this.miniGame.hideMiniGame();
                  
                  spinAgain();
                });

                //ZOOM ANIMATION FOR MINIGAME
                this.toggleFunctions(false);
                this.zoomToCave(true);

              } else {

                //SPIN AGAIN
                spinAgain();
              }
            });
          })
        } else{
          this.autoSpin.isSpinning = false;
          this.spinCounter.currentSpinCount = 0;
          this.autoSpin.setActive();
          this.autoSpin.setEnabled();
          this.playBtn.setEnabled();
          this.spinCounter.updateTextCounter();
          this.toggleButtonsState(true);
        }
      })
    }

    loop(shouldIterate: Boolean) {
      if(this.autoSpin.isSpinning){
        if(shouldIterate)
          this.spinCounter.currentSpinCount++;
        this.spinStart( () => {
          
          if(this.spinCounter.currentSpinCount < this.spinCounter.spinOptions[this.spinCounter.toSpinIndex]){
            const delaySpin = setTimeout(() => {
              this.loop(true);
              clearTimeout(delaySpin);
            }, 500);
          } else{
            this.spinCounter.currentSpinCount = 0;
            this.autoSpin.setActive();
          }
          
          if(this.spinCounter.currentSpinCount == 0){
            this.toggleButtonsState(true);
            this.playBtn.setEnabled();
          }
  
          this.autoSpin.setEnabled();
          this.spinCounter.updateTextCounter();
        })
  
        this.spinCounter.updateTextCounter();
      }
    }


    toggleButtonsState(isActive: boolean = true) {
      this.lines.toggleButtonState(isActive);
      this.betOne.toggleButtonState(isActive);
      this.betMax.toggleButtonState(isActive);
      this.double.toggleButtonState(isActive);
      this.playerInfo.decrement.decrementSprite.interactive = isActive;
      this.playerInfo.increment.incrementSprite.interactive = isActive;
      this.spinCounter.increment.incrementSprite.interactive = isActive;
      this.spinCounter.decrement.decrementSprite.interactive = isActive;
    }

    updateLines() {
      this.playerInfo.changeLinesValue();
      this.lines.updateActiveLinesArray(this.playerInfo.lines);
    }
  
    betToMin() {
      this.playerInfo.currentBetVal = 1;
      this.playerInfo.updateTotalBet();
      this.playerInfo.updateCurrentBet();
    }
  
    betToMax() {
      this.playerInfo.currentBetVal = 10;
      this.playerInfo.updateTotalBet();
      this.playerInfo.updateCurrentBet();
    }
  
    betToDouble() {
      this.playerInfo.currentBetVal *= 2;
      if(this.playerInfo.currentBetVal > 10)
        this.playerInfo.currentBetVal = 10;
  
      this.playerInfo.updateTotalBet();
      this.playerInfo.updateCurrentBet();
    }

    winEvent(pattern: Array<any>) {
      this.winnings = ((this.playerInfo.totalBetVal * 4) * pattern.length);
      
      if (pattern.filter(e => e.combination === 'icon_7').length > 0){
        this.playerInfo.notif.text = 'BONUS GAME!';
        return;
      }

      this.updateToLatestBalance();
      this.megaAnimation();
  
      return;
    }

    updateToLatestBalance() {
      this.playerInfo.currentBalanceVal += this.winnings;
      this.playerInfo.updateBalance();
      this.playerInfo.notif.text = `Win: ${this.winnings}`;
    }
  
    megaAnimation() {
      if(this.winnings < (this.playerInfo.totalBetVal * 5) * 3 && this.showMegaWin == false)
        return;

      this.megaWin = new MegaWin(this.app);
      this.megaWin.showAnimation(this.winnings);
      this.app.stage.addChild(this.megaWin.container);
      this.showMegaWin = false;
    }

    toggleFunctions(isActive: boolean) {
      this.toggleControl(isActive);
      this.toggleReels(isActive);
    }

    toggleControl(isActive: boolean) {
      if(isActive){
        gsap.to(this.container, {
          y: this.app.screen.height - (this.conHeight - 30), duration: 1, repeat: 0, yoyo: true
        });
      } else{
        gsap.to(this.container, {
          y: this.app.screen.height + 50, duration: 1, repeat: 0, yoyo: true
        });
      }
    }

    toggleReels(isActive: boolean) {
      if(isActive){
        gsap.to(this.reelsContainer.container, {
          y: 70, duration: 1, repeat: 0, yoyo: true
        });
      } else{
        gsap.to(this.reelsContainer.container, {
          y: - this.reelsContainer.container.height, duration: 1, repeat: 0, yoyo: true
        });
      }
    }

    zoomToCave(zoomIn: boolean) {
      if(zoomIn){
        gsap.to(this.app.stage, {
          x: -(this.app.screen.width / 2.5), y: -150, duration: 1, repeat: 0, yoyo: true, onComplete: this.showMiniGame.bind(this)
        });
        gsap.to(this.app.stage.scale, {
          x: 1.8, y: 1.8, duration: 1, repeat: 0, yoyo: true
        });
      } else {
        gsap.to(this.app.stage.scale, {
          x: 1, y: 1, duration: 0.01, repeat: 0, yoyo: true
        });
        this.app.stage.position.set(0,0);
        this.toggleFunctions(true);
      }
    }

    showMiniGame() {
      this.app.stage.addChild(this.miniGame.overlay);
      this.app.stage.addChild(this.miniGame.container);
      this.miniGame.showMiniGame();
      
      this.zoomToCave(false);
    }
}
