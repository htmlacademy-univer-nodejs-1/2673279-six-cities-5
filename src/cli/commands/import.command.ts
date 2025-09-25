import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/tsv-file-reader.js';
import chalk from 'chalk';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    if (!filename) {
      console.error(chalk.red('Filename parameter is required.'));
      return;
    }

    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      const offers = fileReader.toArray();
      console.log(offers);
      console.log(`${offers.length} offers were imported.`);
    } catch (err) {
      console.error(`Can't import data from file: ${filename}`);
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  }
}
