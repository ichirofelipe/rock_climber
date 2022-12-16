import * as PIXI from 'pixi.js';
import Reel from './Reel';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class ReelsContainer {
    public readonly reels: Array<Reel> = [];
    public readonly pattern: Array<any> = [
      [1,1,1,1,1],
      [2,2,2,2,2],
      [3,3,3,3,3],
      [1,2,3,2,1],
      [3,2,1,2,3],
      [1,1,2,1,1],
      [3,3,2,3,3],
      [2,1,1,1,2],
      [2,3,3,3,2],
      //EXTRAS
      // [1,2,1,2,1],
      // [3,2,3,2,3],
      // [2,2,3,2,2],
      // [2,2,1,2,2],
      // [1,2,2,2,1],
      // [3,2,2,2,3],
      // [2,3,2,3,2],
      // [2,1,2,1,2],

      // 4EXTRAS
      [1,1,1,2],
      [3,3,3,2],
      [1,1,2,1],
      [3,3,2,3],
      [1,2,3,3],
      [3,2,1,1],
    ]
    public readonly container: PIXI.Container;
    private readonly winTextures: Array<PIXI.Texture> = [];
    private readonly bonusTextures: Array<PIXI.Texture> = [];
    private borderTexture: PIXI.Texture;
    private winningPattern: Array<any>;
    private currentPattern: number = 0;
    private app: PIXI.Application;
    private REEL_OFFSET_TOP = 70;
    private NUMBER_OF_REELS = 5;
    private reelsToSpin: Array<any> = [];
    private loopBorderAnimation: boolean = true;

    constructor(app: PIXI.Application) {
        this.app = app;
        
        this.container = new PIXI.Container();

        for (let i = 0; i < this.NUMBER_OF_REELS; i++) {
            const reel = new Reel(this.app, i, this.stopBorderAnimation.bind(this));
            this.reels.push(reel);
            this.container.addChild(reel.container);
            this.container.height = reel.container.height;
        }

        //LOAD WINNING EFFECTS / ANIMATIONS
        this.borderTexture = this.app.loader.resources!.main.textures!['frame.png'];
        for(let img in this.app.loader.resources!.win_anim.textures){
          const winTexture = PIXI.Texture.from(img);
          this.winTextures.push(winTexture);
        }

        for(let img in this.app.loader.resources!.bonus_anim.textures){
          const bonusTexture = PIXI.Texture.from(img);
          this.bonusTextures.push(bonusTexture);
        }

        this.init();
    }

    init() {
      this.containerSettings();
    }

    containerSettings() {
      this.container.pivot.x = this.container.width / 2;
      this.container.x = this.app.screen.width / 2;
      this.container.y = this.REEL_OFFSET_TOP;
    }

    async spin (done: (pattern: Array<object>) => void) {
      let doneSpinCount = 0;
      this.reelsToSpin = [...this.reels];

      this.reelsToSpin.forEach( async (reel, index) => {
        reel.hideOverlay();

        this.infiniteSpinning(reel, index).then( () => {
          doneSpinCount++
          if(doneSpinCount == this.reels.length){
            done(this.checkForWin(this.reels));
          }
        });

      });
    }

    private bounceReel(reel:any) {
      reel.sprites.forEach((sprite: PIXI.AnimatedSprite) => {
        sprite.gotoAndStop(0);
      })
      gsap.to(reel.container, {
        y: 30,
        duration: 0.2,
        repeat: 1,
        yoyo: true,
      })
    }
    
    private async infiniteSpinning(reel: any, index: number) {
      const shiftingDelay = 400;

      await gsap.to(reel.container, {
        y: -30,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        delay: index*0.15, //REMOVE THIS TO MAKE REELS GO DOWN ALL AT THE SAME TIME
        onComplete: () => {
          reel['start'] = Date.now();
        }
      })
      while (true) {
        await reel.spinOneTime();
        this.blessRNG(reel);
        const shiftingWaitTime = (this.reels.length - this.reelsToSpin.length + 3) * shiftingDelay;

        if (Date.now() >= reel.start + shiftingWaitTime) {
            const doneReel = this.reelsToSpin.shift();
            this.bounceReel(doneReel);
            return;
        }

        if (!this.reelsToSpin.length) break;
      }
    }

    private blessRNG(reel: Reel) {
      reel.sprites[0].textures = reel.textures[Math.floor(Math.random() * reel.textures.length)];
    }

    private checkForWin(reels: Array<Reel>): Array<any> {
        const winningPattern: Array<any> = [];

        this.pattern.forEach((pat, index) => {
          const combination: Set<string> = new Set();
          reels.forEach((reel, index) => {
            if(pat[index])
              combination.add(reel.sprites[pat[index]].texture.textureCacheIds[0].split('.')[0].split('_00')[0])
          });

          if (combination.size === 1)
            winningPattern.push({'index': index,'combination': [...combination.values()][0]});
        });
        
        return winningPattern;
    }
    
    animateWinningResult(pattern: Array<object>, spinAgain: () => void) {
      if(pattern.length <= 0){
        spinAgain();
      } else{
        this.winningPattern = pattern;

        this.renderAnimationAndBorder( () => {
          spinAgain();
        })
      }
    }
  
    private renderAnimationAndBorder( doneAnimation:() => void) {
      let next: any;
      this.loopBorderAnimation = true;

      const loop = () => {
        const winningPat = this.pattern[this.winningPattern[this.currentPattern].index];
        let animatedWin: Array<PIXI.AnimatedSprite> = [];

        let winAnimationDelay = setTimeout(() => {
          this.reels.forEach((reel, index) =>  {

            //Check if border animation is cancelled
            if(!this.loopBorderAnimation){
              doneAnimation()
              return;
            }

            reel.showOverlay();
            reel.sprites.forEach(symbol => {
              symbol.zIndex = 0;
            });
            
            if(!winningPat[index])
              return;

            //RENDER WINNING ANIMATION AND PLAY
            if(this.winningPattern[this.currentPattern].combination == 'icon_7'){
              animatedWin[index] = new PIXI.AnimatedSprite(this.bonusTextures);
              animatedWin[index].animationSpeed = 0.3;
            } else {
              animatedWin[index] = new PIXI.AnimatedSprite(this.winTextures);
              animatedWin[index].animationSpeed = 0.4;
            }
            reel.sprites[winningPat[index]].addChild(animatedWin[index]);
            reel.sprites[winningPat[index]].zIndex = 2;
            animatedWin[index].loop = false;
            animatedWin[index].anchor.y = -0.15;
            animatedWin[index].play();
            
            //RENDER WINNING BORDER
            let border = new PIXI.Sprite(this.borderTexture);
            reel.sprites[winningPat[index]].addChild(border);
            border.width = (reel.sprites[2].width * 1.5) + 25;
            border.height = (reel.sprites[2].height * 1.5) - 5;
            border.position.set((border.width/2)-15 ,(border.height/2)+5);
            border.anchor.set(0.5);
            border.scale.set(0.92);
            gsap.to(border.scale, {
              x: 1,
              y: 1,
              duration: 0.35,
              repeat: -1,
              yoyo: true,
              yoyoEase: "sine.out"
            })
            if(this.winningPattern[this.currentPattern].combination == 'icon_7')
              border.visible = false
            
            //REMOVE BORDER AND ANIMATION ON COMPLETE OF ANIMATION THEN SPIN AGAIN!
            animatedWin[index].onComplete = () => {
              reel.sprites[winningPat[index]].removeChild(animatedWin[index]);
              reel.sprites[winningPat[index]].removeChild(border);
              clearTimeout(next);
              next = setTimeout(() => {
                this.currentPattern++;
                if(this.currentPattern < this.winningPattern.length){
                  loop();
                } else{
                  this.currentPattern = 0;
                  doneAnimation();
                }

                clearTimeout(next);
              }, 250);
            };
          })
          clearTimeout(winAnimationDelay);
        }, 500);
      }
      

      loop();
      
    }

    //STOP BORDER ICON ANIMATION 
    stopBorderAnimation() {
      this.reels.forEach(reel =>  {
        reel.hideOverlay();
      });
      
      this.loopBorderAnimation = false;
    }
}