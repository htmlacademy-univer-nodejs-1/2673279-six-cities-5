import { createWriteStream, WriteStream } from 'node:fs';

export class TSVFileWriter {
  private stream: WriteStream;

  constructor(public readonly filename: string) {
    this.stream = createWriteStream(this.filename, {
      flags: 'w',
      encoding: 'utf8',
      autoClose: true,
    });
  }

  public write(row: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.stream.write(`${row}\n`)) {
        this.stream.once('drain', () => resolve());
      } else {
        resolve();
      }
    });
  }
}
