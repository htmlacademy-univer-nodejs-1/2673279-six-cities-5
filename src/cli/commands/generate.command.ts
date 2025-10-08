import { Command } from './command.interface.js';
import { MockOffer } from '../../shared/types/index.js';
import { TSVFileWriter } from '../../shared/libs/tsv-file-writer.js';
import { getRandomItem, getRandomNumber } from '../../shared/helpers/common.js';
import axios from 'axios';
import chalk from 'chalk';

export class GenerateCommand implements Command {
  private initialData: MockOffer[] = [];

  public getName(): string {
    return '--generate';
  }

  private async load(url: string): Promise<void> {
    try {
      const { data } = await axios.get<MockOffer[]>(url);
      this.initialData = data;
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, offerCount: number): Promise<void> {
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      const randomOffer = getRandomItem(this.initialData);
      const host = getRandomItem(this.initialData).host;

      const row = [
        randomOffer.title, randomOffer.description, new Date().toISOString(),
        randomOffer.city, randomOffer.previewImage, randomOffer.images.join(';'),
        getRandomItem([true, false]), getRandomItem([true, false]),
        getRandomNumber(1, 5, 1), randomOffer.type, getRandomNumber(1, 8),
        getRandomNumber(1, 10), getRandomNumber(100, 100000),
        randomOffer.goods.join(';'), host.name, host.email, host.avatarUrl, host.type,
        randomOffer.coordinates.latitude, randomOffer.coordinates.longitude,
      ].join('\t');

      await tsvFileWriter.write(row);
    }
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    if (!count || !filepath || !url) {
      console.error(chalk.red('Not all arguments provided. Usage: --generate <count> <filepath> <url>'));
      return;
    }

    const offerCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(filepath, offerCount);
      console.info(chalk.green(`File ${filepath} was created with ${offerCount} offers!`));
    } catch (error) {
      console.error(chalk.red('Can\'t generate data.'));
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
