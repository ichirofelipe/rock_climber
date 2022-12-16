import * as PIXI from 'pixi.js';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import Gems from './Gems';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class MiniGame {
    private readonly app: PIXI.Application;
    private readonly closeMinigGame: (total: number) => void;
    private background: PIXI.Sprite;
    private scoreBoard: PIXI.Sprite;
    private banner: PIXI.Sprite;
    private gems: Gems;
    private gemColors: Array<string> = ['blue', 'green', 'yellow', 'red', 'purple'];
    private gemPercetage: Array<number> = [0, 80, 80, 80, 80, 90, 90, 90, 90, 90, 100, 100, 100, 100, 100, 100, 100, 100, 130, 130, 130, 130, 160, 160, 200];
    private gemsBroken: number = 0;
    private totalBetVal: number;
    private totalGemsValue: number = 0;
    private bannerText: PIXI.Text;
    public overlay: PIXI.Graphics;
    public container: PIXI.Container;

    constructor(app: PIXI.Application, totalBetVal: number, closeMinigGame: (total: number) => void) {
      this.closeMinigGame = closeMinigGame;
      this.app = app;
      this.totalBetVal = totalBetVal;

      this.init();
    }
    
    private init() {
      this.createOverlay();
      this.containerSettings();
      this.createBackground();
      this.createScoreBoard();
      this.createBanner();
      this.createBannerText();
      this.createGems();
    }

    private createOverlay() {
      this.overlay = new PIXI.Graphics();
      this.overlay.beginFill(0x000000)
      .drawRect(0,0,this.app.screen.width, this.app.screen.height)
      .endFill();
    }

    private containerSettings() {
      this.container = new PIXI.Container();
      this.container.width = this.app.screen.width;
      this.container.height = this.app.screen.height;
      this.container.alpha = 0;
      this.container.sortableChildren = true;
    }

    private createBackground() {
      const texture = this.app.loader.resources!.bonus.textures!['bonus_background.png'];
      this.background = new PIXI.Sprite(texture);
      this.background.width = this.app.screen.width;
      this.background.height = this.app.screen.height;
      this.background.zIndex = 0;

      this.container.addChild(this.background);
    }

    private createScoreBoard() {
      const texture = this.app.loader.resources!.bonus.textures!['bonus_game_screen.png'];
      this.scoreBoard = new PIXI.Sprite(texture);
      this.scoreBoard.scale.set(0.8);
      this.scoreBoard.x = (this.app.screen.width / 2) - (this.scoreBoard.width / 2);
      this.scoreBoard.zIndex = 2;

      this.container.addChild(this.scoreBoard);
    }

    private createBanner() {
      const texture = this.app.loader.resources!.bonus.textures!['bonus_game_logo.png'];
      this.banner = new PIXI.Sprite(texture);
      this.banner.scale.set(0.8);
      this.banner.x = this.app.screen.width / 2;
      this.banner.anchor.x = 0.5;
      this.banner.y = this.scoreBoard.height - 15;
      this.scoreBoard.zIndex = 1;

      this.container.addChild(this.banner);
    }

    private createBannerText() {
      const style = new PIXI.TextStyle({
        fontFamily: 'Questrial',
        fontSize: 40,
        fill: '#ffffff',
      });

      this.bannerText = new PIXI.Text(this.totalGemsValue, style);
      this.bannerText.x = (this.scoreBoard.width / 0.8)/2;
      this.bannerText.y = (this.scoreBoard.height / 0.8)/2;
      this.bannerText.anchor.set(0.5, 0.1);
      this.scoreBoard.addChild(this.bannerText);
    }

    private createGems() {
      let posX = 0;
      this.gemColors.forEach( color => {
        let percentage = this.gemPercetage[Math.floor(Math.random() * this.gemPercetage.length)];
        console.log('percentage',percentage);
        let gemValue = Math.round((this.totalBetVal / 100) * percentage);
        this.gems = new Gems(this.app, color, gemValue, this.countGemsBroken.bind(this));
        this.gems.gemsAnimation.scale.set(0.7);
        if(posX == 0)
          posX = (this.app.screen.width - (this.gems.gemsAnimation.width * 5)) / 2;

        this.gems.gemsAnimation.x = posX;
        this.gems.gemsAnimation.y = this.app.screen.height/2;
        
        posX += this.gems.gemsAnimation.width;
        this.gems.gemsAnimation.addChild(this.gems.gemValueText);
        this.gems.gemValueText.x = (this.gems.gemsAnimation.width / 0.7) / 2;
        this.gems.gemValueText.y = (this.gems.gemsAnimation.height / 0.7) / 2;
        this.gems.gemValueText.anchor.set(0.5);
        this.gems.gemValueText.alpha = 0;
        this.container.addChild(this.gems.gemsAnimation);
      })
    }

    showMiniGame() {
      gsap.to(this.container, {
        alpha: 1, duration: 1, repeat: 0, yoyo: true
      })
    }

    hideMiniGame() {
      this.app.stage.removeChild(this.overlay);
      gsap.to(this.container, {
        alpha: 0, duration: 1, repeat: 0, yoyo: true,
        onComplete: () => {
          this.app.stage.removeChild(this.container);
        }
      })
    }

    countGemsBroken(value: number) {
      this.totalGemsValue += value;
      this.bannerText.text = this.totalGemsValue;
      this.gemsBroken++;

      if(this.gemsBroken == this.gemColors.length){
        setTimeout(() => {
          this.closeMinigGame(this.totalGemsValue);
        }, 1000);
      }
    }
}