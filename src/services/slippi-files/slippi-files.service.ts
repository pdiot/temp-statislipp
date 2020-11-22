import { Injectable } from '@angular/core';
import SlippiGame from '@slippi/slippi-js';
import { SlippiGameConstants } from 'src/interfaces/const';
import { EnrichedGameFile } from 'src/interfaces/outputs';


@Injectable({
  providedIn: 'root'
})
export class SlippiFilesService {


  constructor() { }

  public async enrichGameFiles(datas: { gameFile: string, game: SlippiGame }[]): Promise<EnrichedGameFile[]> {
    let enrichedGameFiles = [];
    /**
     * enrichedGameFiles : [
     *       {
     *          file: string,
     *          playerCharacterPairs: [
     *              {player: string, character: FullChar}
     *          ],
     *          stage: string, 
     *       } 
     * ]
     * 
     */

    for (const data of datas) {
      const game = data.game;
      const gameFile = data.gameFile;
      const meta = game.getMetadata();
      const stage = this.getMapName(game.getSettings().stageId);
      if (!stage) {
        break;
      }
      if (Object.keys(meta.players).length > 2) {
        console.log(`Excluding game ${gameFile} because it has more than 2 players`);
        break;
      }
      let playerCharacterPairs;
      console.log('meta.players : ', meta.players);
      if (meta.players[2] ||
        meta.players[3] ||
        (meta.players[0] && !(meta.players[0] as any).names.code) ||
        (meta.players[1] && !(meta.players[1] as any).names.code)) {
        console.log('local game : ', gameFile);
        // it's a local game
        let playerA;
        let playerB;
        let characterSlotA;
        let characterSlotB;
        if (meta.players[0]) {
          playerA = 'PORT1';
          characterSlotA = 0;
          if (meta.players[1]) {
            playerB = 'PORT2';
            characterSlotB = 1;
          } else if (meta.players[2]) {
            playerB = 'PORT3';
            characterSlotB = 2;
          } else if (meta.players[3]) {
            playerB = 'PORT4';
            characterSlotB = 3;
          }
        } else if (meta.players[1]) {
          playerA = 'PORT2';
          characterSlotA = 1;
          if (meta.players[2]) {
            playerB = 'PORT3';
            characterSlotB = 2;
          } else if (meta.players[3]) {
            playerB = 'PORT4';
            characterSlotB = 3;
          }
        } else {
          playerA = 'PORT3';
          characterSlotA = 2;
          playerB = 'PORT4';
          characterSlotB = 3;
        }
        playerCharacterPairs = [
          {
            player: playerA,
            character: this.getFullChar(Object.keys(meta.players[characterSlotA].characters)[0])
          },
          {
            player: playerB,
            character: this.getFullChar(Object.keys(meta.players[characterSlotB].characters)[0])
          }
        ];
      } else {
        console.log('online game : ', gameFile);
        playerCharacterPairs = [
          {
            player: (meta.players[0] as any).names.code,
            character: this.getFullChar(Object.keys(meta.players[0].characters)[0])
          },
          {
            player: (meta.players[1] as any).names.code,
            character: this.getFullChar(Object.keys(meta.players[1].characters)[0])
          }
        ];
      }
      enrichedGameFiles.push({
        file: gameFile,
        playerCharacterPairs: playerCharacterPairs,
        stage: stage
      });
    }
    console.log('File enriching done');
    return Promise.resolve(enrichedGameFiles);
  }

private getMapName(id) {
  if (SlippiGameConstants.EXTERNALSTAGES.find(stage => stage.id === +id)) {
    return SlippiGameConstants.EXTERNALSTAGES.find(stage => stage.id === +id).name;
  }
  return undefined;
}

private getFullChar(id) {
  return SlippiGameConstants.EXTERNALCHARACTERS.find(char => char.id === +id);
}
}
