import { createReadStream } from 'node:fs';
import { EventEmitter } from 'node:events';
import { FileReader } from './file-reader.interface.js';

export class TSVFileReader extends EventEmitter implements FileReader {
  constructor(private readonly filename: string) {
    super();
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: 16384,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        if (importedRowCount > 1) {
          this.emit('line', completeRow);
        }
      }
    }

    this.emit('end', importedRowCount - 1);
  }
}
