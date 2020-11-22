import { Injectable } from '@angular/core';
import SlippiGame from '@slippi/slippi-js';

@Injectable({
  providedIn: 'root'
})
export class FileOpenerService {

  constructor() { }

  public async readFileAsSlippiGame(file: File): Promise<SlippiGame> {
    const data = (await this.readFileAsArrayBuffer(file)) as ArrayBuffer;
    const arr = new Int8Array(data);
    const buf = Buffer.from(arr);
    return new SlippiGame(buf);
  }

  private async readFileAsArrayBuffer(file: File): Promise<string | ArrayBufferLike> {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onabort = () => reject("file reading was aborted");
      fr.onerror = () => reject("file reading has failed");
      if (fr.readAsBinaryString) {
        fr.addEventListener(
          "load",
          function () {
            const string = (this as any).resultString != null ? (this as any).resultString : this.result;
            const result = new Uint8Array(string.length);
            for (let i = 0; i < string.length; i++) {
              result[i] = string.charCodeAt(i);
            }
            resolve(result.buffer);
          },
          false
        );
        fr.readAsBinaryString(file);
      } else {
        fr.addEventListener(
          "load",
          function () {
            if (this.result) {
              resolve(this.result);
            } else {
              reject("no data read");
            }
          },
          false
        );
        fr.readAsArrayBuffer(file);
      }
    });
  }
}
