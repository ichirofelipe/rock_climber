import * as PIXI from 'pixi.js';
var WebFont = require('webfontloader');

export default class Loader {
    public loader: PIXI.Loader;
    private loadingScreen: PIXI.Text;

    constructor(app: PIXI.Application, onAssetsLoaded: () => void) {
        this.loader = app.loader;
        
        this.loadAssets();

        WebFont.load({
            google: {
              families: ['Libre Franklin', 'Questrial', 'Libre Franklin:900', 'Libre Franklin:500']
            },
            active: () => {
                this.generateLoadingScreen(app.screen.width, app.screen.height);
                app.stage.addChild(this.loadingScreen);

                this.loader.load(() => {
                    app.stage.removeChild(this.loadingScreen);
                    onAssetsLoaded();
                });
            }
        });
        
    }

    private loadAssets() {
        this.loader.add('main', './assets/images/main_game/main.json');
        this.loader.add('bonus', './assets/images/bonus_game/bonus.json');
        this.loader.add('logo_anim', './assets/images/animations/logo/logo_anim.json');
        this.loader.add('win_anim', './assets/images/animations/win_effect/win.json');
        this.loader.add('pers_anim', './assets/images/animations/pers/pers_idle/pers_idle.json');
        this.loader.add('fire_anim', './assets/images/animations/fire/fire.json');
        this.loader.add('mega_win_anim', './assets/images/animations/mega_win/mega_win.json');
        this.loader.add('tablo_anim', './assets/images/animations/tablo/tablo.json');
        this.loader.add('bonus_anim', './assets/images/animations/bonus/bonus.json');
        this.loader.add('blue_gem_idle', './assets/images/animations/gems/blue_idle/blue_idle.json');
        this.loader.add('green_gem_idle', './assets/images/animations/gems/green_idle/green_idle.json');
        this.loader.add('yellow_gem_idle', './assets/images/animations/gems/yellow_idle/yellow_idle.json');
        this.loader.add('red_gem_idle', './assets/images/animations/gems/red_idle/red_idle.json');
        this.loader.add('purple_gem_idle', './assets/images/animations/gems/purple_idle/purple_idle.json');
        this.loader.add('blue_gem_breaking', './assets/images/animations/gems/blue_breaking/blue_breaking.json');
        this.loader.add('green_gem_breaking', './assets/images/animations/gems/green_breaking/green_breaking.json');
        this.loader.add('yellow_gem_breaking', './assets/images/animations/gems/yellow_breaking/yellow_breaking.json');
        this.loader.add('red_gem_breaking', './assets/images/animations/gems/red_breaking/red_breaking.json');
        this.loader.add('purple_gem_breaking', './assets/images/animations/gems/purple_breaking/purple_breaking.json');
        this.loader.add('coin_anim', './assets/images/animations/coin/coin.json');
        this.loader.add('ui', './assets/images/main_game/ui/ui.json');
        this.loader.add('symbol1', './assets/images/animations/blured_icons/icon_1/icon_1.json');
        this.loader.add('symbol2', './assets/images/animations/blured_icons/icon_2/icon_2.json');
        this.loader.add('symbol3', './assets/images/animations/blured_icons/icon_3/icon_3.json');
        this.loader.add('symbol4', './assets/images/animations/blured_icons/icon_4/icon_4.json');
        this.loader.add('symbol5', './assets/images/animations/blured_icons/icon_5/icon_5.json');
        this.loader.add('symbol6', './assets/images/animations/blured_icons/icon_6/icon_6.json');
        this.loader.add('symbol7', './assets/images/animations/blured_icons/icon_7/icon_7.json');
        this.loader.add('symbol8', './assets/images/animations/blured_icons/icon_8/icon_8.json');
    }

    private generateLoadingScreen(appWidth: number, appHeight: number) {
        const style = new PIXI.TextStyle({
            fontFamily: 'Questrial',
            fontSize: 36,
            fontWeight: 'bold',
            fill: '#ffffff',
        });
        const playText = new PIXI.Text('Loading...', style);
        playText.x = (appWidth - playText.width) / 2;
        playText.y = (appHeight - playText.height) / 2;
        this.loadingScreen = playText;
    }
}
