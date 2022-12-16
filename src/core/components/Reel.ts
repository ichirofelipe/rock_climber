import * as PIXI from 'pixi.js';

import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class Reel {
    public readonly container: PIXI.Container;
    public readonly textures: Array<any> = [];
    public symbolAnimation: Array<PIXI.Texture> = [];
    public sprites: Array<PIXI.AnimatedSprite> = [];
    private readonly appHeight: number;
    private readonly ticker: PIXI.Ticker;
    private readonly reelOffsetX: number = 20;
    private readonly reelOffsetY: number = 0;
    private readonly symbolHeight: number = 115;
    private readonly symbolWidth: number = 95;
    private readonly rows: number = 3;
    private overlay: Array<Array<PIXI.Graphics>> = [];
    private onClick: () => void;
    private position: number;
    private isAnimationActive: any;
    public reelOdds: Array<Array<number>> = [
      [1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 5, 5, 6, 6, 6, 7, 7],
      [1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5, 6, 6, 6, 6, 7],
      [1, 1, 1, 1, 2, 2, 3, 3, 4, 5, 5, 5, 6, 6, 7, 7, 7],
      [1, 2, 2, 3, 3, 3, 4, 5, 5, 5, 5, 6, 6, 7, 7, 7, 7],
      [1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 5, 6, 6, 7, 7, 7]
    ]
    public reelSpinning: boolean = false;

    constructor(app: PIXI.Application, position: number, onClick: () => void) {
      this.appHeight = app.screen.height;
      this.position = position;
      this.onClick = onClick;
      this.ticker = app.ticker;
      this.container = new PIXI.Container();
      this.overlay[position] = [];

      const symbols = Object.values(app.loader.resources!).filter( asset => {
        if(!asset.name.includes('symbol'))
          return false
        if(asset.extension == 'png')
          return false
        return true
      } )
      
      symbols.forEach(symbol => {
        this.symbolAnimation = [];
        for(let img in symbol.textures){
          const texture = PIXI.Texture.from(img);
          this.symbolAnimation.push(texture);
        }
        this.textures.push(this.symbolAnimation);
      })

      this.init();
    }

    private init() {
      this.containerSettings();
      this.generate();
    }

    private containerSettings() {
      this.container.x = this.position * this.symbolWidth;
      this.container.sortableChildren = true;
    }

    private generate() {
      const REEL_WIDTH = this.symbolWidth;
      const NUMBER_OF_ROWS = this.rows;

      for (let i = 0; i < NUMBER_OF_ROWS + 1; i++) {
          let randSymbol = Math.floor(Math.random() * this.reelOdds[this.position].length);
          let texture = this.reelOdds[this.position][randSymbol];
          const symbol = new PIXI.AnimatedSprite(this.textures[texture]);
          symbol.width = this.symbolWidth;
          symbol.height = this.symbolHeight;
          const widthDiff = REEL_WIDTH - symbol.width;
          symbol.x = this.position * this.reelOffsetX + widthDiff / 2;
          const yOffset = this.reelOffsetY;
          const cellHeight = symbol.height + yOffset;
          const paddingTop = yOffset / 2;
          symbol.y = (i - 1) * cellHeight + paddingTop;
          this.createOverlay(symbol, i);
          this.sprites.push(symbol);
          this.container.addChild(symbol);
      }
    }

    spinOneTime() {
      let doneRunning = false;
      let reelSpeed = 40;
      const reelHeight = ((this.symbolHeight + this.reelOffsetY) * this.rows);
      return new Promise<void>(resolve => {
        
        const tick = () => {
          for (let i = this.sprites.length - 1; i >= 0; i--) {
            const symbol = this.sprites[i];

            symbol.play();
            symbol.animationSpeed = 0.3;
            symbol.loop = false;
            
            if (symbol.y + reelSpeed > reelHeight + this.reelOffsetY) {
              doneRunning = true;
              reelSpeed = reelHeight - symbol.y + (this.reelOffsetY/2);
              symbol.y = -(symbol.height + (this.reelOffsetY/2));
            } else {
              symbol.y += reelSpeed;
            }

            if (i === 0 && doneRunning) {
              let t = this.sprites.pop();
              if (t) this.sprites.unshift(t);
              this.ticker.remove(tick);
              resolve();
            }
          }
          
        }

        this.ticker.add(tick);
      });
    }

    private createOverlay(symbol: PIXI.AnimatedSprite, row: number) {
      this.overlay[this.position][row] = new PIXI.Graphics();
      this.overlay[this.position][row].beginFill(0x000000)
      .drawRect(symbol.x -(this.reelOffsetX/2), symbol.y, this.symbolWidth+this.reelOffsetX, this.symbolHeight)
      .endFill();
      this.overlay[this.position][row].alpha = 0;
      this.overlay[this.position][row].interactive = false;
      this.overlay[this.position][row].zIndex = 1;
      this.overlay[this.position][row].addListener('pointerdown', this.onClick);

      this.container.addChild(this.overlay[this.position][row])
    }

    showOverlay() {
      this.overlay.forEach(row => {
        row.forEach(overlay => {
          overlay.interactive = true;
          overlay.buttonMode = true;
          gsap.to(overlay, {
            alpha: 0.6,
            duration: 0.5,
          })
        })
      })
    }

    hideOverlay() {
      this.overlay.forEach(row => {
        row.forEach(overlay => {
          overlay.interactive = false;
          overlay.buttonMode = false;
          gsap.to(overlay, {
            alpha: 0,
            duration: 0.5,
          })
        })
      })
    }
}
