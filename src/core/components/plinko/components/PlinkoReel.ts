import * as PIXI from 'pixi.js';

export default class PlinkoReel{
  private objBx: Array<PIXI.Graphics> = [];
  private colorBx: Array<number> = [0xFFFFFF, 0xDDDDDD,0xBBBBBB, 0x999999, 0x777777, 0x555555, 0x333333];
  private ticker: PIXI.Ticker;
  private app: PIXI.Application;
  public container: PIXI.Container;
  public height: number = 100;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.container = new PIXI.Container;

    this.createReel();
  }

  private createReel() {
    const width = this.app.screen.width / (this.colorBx.length - 1);
    this.colorBx.forEach((color, index) => {
      let box = new PIXI.Graphics();
      box.beginFill(color)
      .drawRect(0, 0, width, this.height)
      .endFill();
      box.x = width*index;
      box.y = this.app.screen.height - box.height;
  
      this.objBx.push(box);
  
      this.container.addChild(box);
    })
  
    this.ticker = new PIXI.Ticker();
  
    this.ticker.add(this.infiniteMove.bind(this))
  
    this.ticker.start();
  }
  
  private infiniteMove() {
    let speed = 5;
    this.objBx.forEach(box => {
      if((box.x + box.width) - speed == 0){
        box.x = this.app.screen.width;
      }
      box.x -= speed;
    })
  }

  public animateHitBlock(coin: PIXI.Graphics) {
    let block:PIXI.Graphics;
    let distanceToBall!:number;
    this.objBx.forEach((box, index) => {
      let distance = (coin.x - box.x);

      if(coin.x > box.x){
        if(distanceToBall === undefined || distanceToBall > distance){
          block = box;
          distanceToBall = distance;
        }
      }
    });

    block!.alpha = 0.3;
    let undo = setTimeout(() => {
      block!.alpha = 1;
      clearTimeout(undo);
    }, 1000);
  }
}


