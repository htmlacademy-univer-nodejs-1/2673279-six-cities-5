import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/tsv-file-reader.js';
import { createOffer, getErrorMessage } from '../../shared/helpers/index.js';
import chalk from 'chalk';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  private onLine(line: string) {
    const offer = createOffer(line);
    console.log(offer);
  }

  private onComplete(count: number) {
    console.log(chalk.green(`${count} rows imported successfully.`));
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    if (!filename) {
      console.error(chalk.red('Filename parameter is required.'));
      return;
    }

    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      console.error(chalk.red(`Can't import data from file: ${filename}`));
      console.error(getErrorMessage(err));
    }
  }
}
