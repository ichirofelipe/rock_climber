import * as PIXI from 'pixi.js';

export default class Lines {
    public readonly linesSprite: PIXI.Sprite;
    private readonly onClick: () => void;
    private readonly linesTexture: PIXI.Texture;
    private readonly linesActiveTexture: PIXI.Texture;
    private readonly app: PIXI.Application;
    private linesArray: Array<any> = [
      {
        'value': 1,
        'isActive': false,
      },
      {
        'value': 3,
        'isActive': false,
      },
      {
        'value': 5,
        'isActive': false,
      },
      {
        'value': 7,
        'isActive': false,
      },
      {
        'value': 9,
        'isActive': false,
      }
    ] 

    constructor(app: PIXI.Application, onClick: () => void) {
        this.onClick = onClick;
        this.app = app;
        this.linesTexture = app.loader.resources!.ui.textures!['lines.png'];
        this.linesActiveTexture = app.loader.resources!.ui.textures!['lines_active.png'];
        this.linesSprite = new PIXI.Sprite(this.linesTexture);
        this.init();
    }

    private init() {
        this.linesSprite.interactive = true;
        this.linesSprite.buttonMode = true;
        this.linesSprite.scale.set(0.7);
        this.linesSprite.addListener('pointerdown', this.onClick);
        this.renderLinesIndicator();
    }

    updateActiveLinesArray(currentLine: number) {
      this.linesArray = this.linesArray.map( lines => {
        lines['sprite'].texture = lines['textureInactive']       
        if(lines.value == currentLine)
          lines['sprite'].texture = lines['textureActive']

        return lines;
      })
    }

    private renderLinesIndicator() {
      const lineNumberContainer = new PIXI.Container();
      let x = 0;
      this.linesArray.forEach( lines => {
        lines['textureInactive'] = this.app.loader.resources!.ui.textures![`${lines.value}_lines.png`];
        lines['textureActive'] = this.app.loader.resources!.ui.textures![`${lines.value}_lines_active.png`];
        const spriteInactive = new PIXI.Sprite(lines['textureInactive']);
        const spriteActive = new PIXI.Sprite(lines['textureActive']);

        lines['sprite'] = spriteInactive;
        if(lines.isActive)
          lines['sprite'] = spriteActive;

        lines['sprite'].x = x;
        lines['sprite'].anchor.y = 1;
        x += lines['sprite'].width;
        lineNumberContainer.addChild(lines['sprite']);
      })
      lineNumberContainer.scale.set(0.9);
      lineNumberContainer.x = ((this.linesSprite.width / 0.7)) / 2 - (lineNumberContainer.width / 2);
      lineNumberContainer.y = 10;

      this.linesSprite.addChild(lineNumberContainer);
    }

    toggleButtonState(isActive: boolean = true) {
      this.linesSprite.interactive = isActive;
      this.linesSprite.texture = this.linesTexture;
      if(!isActive)
        this.linesSprite.texture = this.linesActiveTexture;
    }
}
