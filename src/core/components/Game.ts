import * as PIXI from 'pixi.js';
import Loader from './Loader';
import Background from './Background';
import Logo from './Logo';
import PersonIdle from './PersonIdle';
import Fire from './Fire';
import ReelsContainer from './ReelsContainer';
import Controls from './Controls';
import Plinko from './plinko/Plinko';

export default class Game {
  public app: PIXI.Application;
  public reelsContainer: ReelsContainer;
  private controls: Controls;

  constructor() {
      this.app = new PIXI.Application({ width: 960, height: 600 });
      window.document.body.appendChild(this.app.view);
      new Loader(this.app, this.init.bind(this));

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            this.app.ticker.stop();
        }
        else {
            this.app.ticker.start();
        } 
    });
  }

  private init() {
    this.createReels();
    this.createScene();
    this.createPerson();
    this.createFire();
    this.createLogo();
    this.createControls();
    // this.createPlinko();
  }

  private createScene() {
    const bg = new Background(this.app);
    this.app.stage.addChild(bg.sprite);
  }

  private createPerson() {
    const person = new PersonIdle(this.app);
    this.app.stage.addChild(person.personAnimate);
  }

  private createFire() {
    const fire = new Fire(this.app);
    this.app.stage.addChild(fire.fireAnimate);
  }

  private createLogo() {
    const logoSprite = new Logo(this.app);
    this.app.stage.addChild(logoSprite.animatedSprite);
  }

  private createReels() {
    this.reelsContainer = new ReelsContainer(this.app);
    this.app.stage.addChild(this.reelsContainer.container);
  }

  private createControls() {
    this.controls = new Controls(this.app, this.reelsContainer);
    this.app.stage.addChild(this.controls.container);
  }


  private createPlinko() {
    const plinko = new Plinko(this.app);
    this.app.stage.addChild(plinko.container);
  }

}