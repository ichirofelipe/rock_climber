import * as PIXI from 'pixi.js';
import TextBox from './textbox/TextBox';

import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";

gsap.registerPlugin(PixiPlugin, Physics2DPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class MegaWin {
    private readonly megaWinTextures: Array<PIXI.Texture> = [];
    private readonly coinTextures: Array<PIXI.Texture> = [];
    private readonly app: PIXI.Application;
    private megaWinStarsTexture: PIXI.Texture;
    private megaWinRaysTexture: PIXI.Texture;
    private megaWinRaysSprite: PIXI.Sprite;
    private megaWinStarsSprite: PIXI.Sprite;
    private megaWinAnimate: PIXI.AnimatedSprite;
    private coinAnimate: PIXI.AnimatedSprite;
    private coins: Array<any> = [];
    public toShowMegaWin: boolean = false;
    public container: PIXI.Container;
    public overlay: PIXI.Graphics;
    public winningTextBox: TextBox;

    constructor(app: PIXI.Application) {
        this.app = app;

        this.init();
        this.containerSettings();
        this.overlaySettings();
        this.winningsSettings();
        this.animationSettings();
        this.starSettings();
        this.raysSettings();
        this.renderChildren();
        this.coinSettings()
    }

    init() {
      this.container = new PIXI.Container();
      for(let img in this.app.loader.resources!.mega_win_anim.textures){
        const texture = PIXI.Texture.from(img);
        this.megaWinTextures.push(texture);
      }
      for(let img in this.app.loader.resources!.coin_anim.textures){
        const texture = PIXI.Texture.from(img);
        this.coinTextures.push(texture);
      }  
      this.megaWinAnimate = new PIXI.AnimatedSprite(this.megaWinTextures);

      this.megaWinStarsTexture = this.app.loader.resources!.main.textures!['stars.png'];
      this.megaWinStarsSprite = new PIXI.Sprite(this.megaWinStarsTexture);

      this.megaWinRaysTexture = this.app.loader.resources!.main.textures!['rays.png'];
      this.megaWinRaysSprite = new PIXI.Sprite(this.megaWinRaysTexture);

      this.container.interactive = true;
      this.container.buttonMode = true;
      this.container.addListener('pointerdown', this.closeMegaWin.bind(this));
    }

    containerSettings(){
        this.container.position.set(this.app.screen.width/2, this.app.screen.height/2);
        this.container.pivot.set(this.app.screen.width/2, this.app.screen.height/2);
        this.container.width = this.app.screen.width;
        this.container.height = this.app.screen.height;
    }

    overlaySettings() {
        this.overlay = new PIXI.Graphics();
        this.overlay.beginFill(0x000000)
        .drawRect(0, 0, this.app.screen.width, this.app.screen.height)
        .endFill();

        this.overlay.alpha = 0;
    }

    animationSettings() {
        this.megaWinAnimate.animationSpeed = 0.4;
        this.megaWinAnimate.x = (this.app.screen.width - this.megaWinAnimate.width) - 10;
        this.megaWinAnimate.y = (this.app.screen.height - this.megaWinAnimate.height) + 30;
        this.megaWinAnimate.anchor.set(0.5);
        // this.megaWinAnimate.alpha = 0;
        this.megaWinAnimate.scale.set(0);
        this.megaWinAnimate.play();
    }

    starSettings() {
        this.megaWinStarsSprite.x = (this.app.screen.width / 2) - 15;
        this.megaWinStarsSprite.y = (this.app.screen.height / 2) - 40;
        this.megaWinStarsSprite.anchor.set(0.5);
        this.megaWinStarsSprite.scale.set(0);
    }

    raysSettings() {
        this.megaWinRaysSprite.x = (this.app.screen.width / 2) - (this.megaWinRaysSprite.width / 2);
        this.megaWinRaysSprite.y = (this.app.screen.height / 2) - (this.megaWinRaysSprite.height / 2);
        this.megaWinRaysSprite.alpha = 0;
    }

    winningsSettings() {
        this.winningTextBox = new TextBox(this.app, 0);
        this.winningTextBox.text.style.fontSize = 24;
        this.winningTextBox.text.style.fontWeight = '500';
        this.winningTextBox.text.style.fill = '#ffffff';
        this.winningTextBox.text.style.fontFamily = 'Libre Franklin';
        this.winningTextBox.container.scale.set(1.75);
        this.winningTextBox.container.x = ((this.app.screen.width/2) - (this.winningTextBox.container.width/2));
        this.winningTextBox.container.y = ((this.app.screen.height/2) - (this.winningTextBox.container.height/2)) + (this.megaWinAnimate.height/2);
    }

    coinSettings() {
      let coinsCount = 300;
      
      for(let i=0; i<coinsCount; i++){
        let randNum = Math.random() * 20;
        let randRotation = Math.random() * 20;
        let randSpeed = (Math.random() * 100) / 100;
        let angle = Math.random() * 40 + 250;
        if(angle < 270)
          randRotation *= -1;
        
        this.coinAnimate = new PIXI.AnimatedSprite(this.coinTextures);
        this.coinAnimate.scale.set(0.3);
        this.coinAnimate.x = this.app.screen.width/2;
        this.coinAnimate.y = this.app.screen.height + (this.coinAnimate.height/2);
        this.coinAnimate.anchor.set(0.5);
        this.coinAnimate.animationSpeed = randSpeed;
        this.coins[i] = this.coinAnimate;
        let cointl = gsap.timeline();

        cointl.to(this.coins[i], {
          duration: 5,
          rotation: randRotation,
          physics2D: {velocity:Math.random() * 200 + 850, angle: angle, gravity:1500, acceleration: 100, accelerationAngle: 180},
          onStart: () => {
            this.coins[i].play();
          }
        }, randNum)
        this.container.addChild(this.coins[i]);
      }

      this.container.addChild(this.winningTextBox.container);
    }
      
    renderChildren() {
      this.container.addChild(this.overlay);
      this.container.addChild(this.megaWinRaysSprite);
      this.container.addChild(this.megaWinStarsSprite);
      this.container.addChild(this.megaWinAnimate);
    }     

    showAnimation(winnings: number) {
      let target = { val: 0 };

      gsap.to(this.overlay, {
        alpha: 0.8,
        duration: 0.5,
      })

      gsap.to(this.megaWinAnimate.scale, {
        x: 0.9,
        y: 0.9,
        duration: 0.5,
      })

      gsap.to(this.megaWinRaysSprite, {
        alpha: 1,
        duration: 1,
        delay: 0.35,
      })

      gsap.to(this.megaWinStarsSprite.scale, {
        x: 0.9,
        y: 0.9,
        duration: 0.35,
        delay: 0.35,
        ease: "back.out(1.4)",
      })

      gsap.to(target, {
        val: winnings,
        duration: 4,
        ease: "power1.in",
        onUpdate: () => {
          this.winningTextBox.text.text = `${target.val.toFixed(0)}$`;
        },
        onComplete: () => {
          const megaWinDelayClose = setTimeout(() => {
            this.closeMegaWin();
            clearTimeout(megaWinDelayClose);
          }, 3000);
        }
      });
    }

    closeMegaWin() {
      gsap.to(this.overlay, {
        alpha: 0,
        duration: 0.5
      })
      
      gsap.to(this.megaWinAnimate.scale, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "back.in(1.4)",
        onComplete: () => {
          this.megaWinAnimate.stop();
          this.app.stage.removeChild(this.container);
        }
      })

      gsap.to(this.megaWinRaysSprite, {
        alpha: 0,
        duration: 0.5,
      })

      gsap.to(this.winningTextBox.container, {
        alpha: 0,
        duration: 0.5,
      })

      gsap.to(this.megaWinStarsSprite.scale, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "back.in(1.4)",
      })

      this.coins.forEach(coin => {
        gsap.to(coin, {
          alpha: 0,
          duration: 0.5,
          onComplete: () => {
            coin.stop();
            this.container.removeChild(coin);
          }
        })
      })
    }
}
