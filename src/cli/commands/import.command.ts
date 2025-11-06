import mongoose from 'mongoose';
import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { createOffer, getMongoURI } from '../../shared/helpers/index.js';
import { Logger, PinoLogger } from '../../shared/libs/logger/index.js';

import { UserModel } from '../../shared/modules/user/user.entity.js';
import { OfferModel } from '../../shared/modules/offer/offer.entity.js';

import { DefaultUserService } from '../../shared/modules/user/default-user.service.js';
import { DefaultOfferService } from '../../shared/modules/offer/default-offer.service.js';

import { OfferData } from '../../shared/types/index.js';
import { CreateUserDto } from '../../shared/modules/user/dto/create-user.dto.js';

const CLI_SALT = process.env.SALT ?? 'default-salt-string-for-cli';

export class ImportCommand implements Command {
  private logger: Logger;
  private userService: DefaultUserService;
  private offerService: DefaultOfferService;
  private databaseURI: string;
  private fileReader!: TSVFileReader;

  constructor() {
    this.logger = new PinoLogger();
    this.userService = new DefaultUserService(this.logger, UserModel as any);
    this.offerService = new DefaultOfferService(this.logger, OfferModel as any);

    this.databaseURI = getMongoURI(
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      process.env.DB_HOST,
      Number(process.env.DB_PORT),
      process.env.DB_NAME
    );
  }

  public getName(): string {
    return '--import';
  }

  private async onLine(line: string) {
    const offer = createOffer(line) as OfferData;

    try {
      const hostDto: CreateUserDto = {
        ...offer.host,
        password: offer.host.password || 'default-password' //
      };
      const host = await this.userService.findOrCreate(hostDto, CLI_SALT);

      await this.offerService.create({
        ...offer,
        host: host.id,
      });

    } catch (error) {
      this.logger.error(`Error importing offer: ${offer.title}`, error as Error);
    }
  }

  private onComplete(count: number) {
    this.logger.info(`${count} rows imported successfully.`);
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    if (!filename) {
      this.logger.error('Filename parameter is required.', new Error('Missing filename'));
      return;
    }

    this.fileReader = new TSVFileReader(filename.trim());
    this.fileReader.on('line', this.onLine.bind(this));
    this.fileReader.on('end', this.onComplete.bind(this));

    try {
      this.logger.info(`Connecting to database: ${this.databaseURI}`);
      await mongoose.connect(this.databaseURI);
      this.logger.info('Database connection established.');

      this.logger.info(`Starting import from file: ${filename}`);
      await this.fileReader.read();

    } catch (err) {
      this.logger.error(`Can't import data from file: ${filename}`, err as Error);
    } finally {
      this.logger.info('Disconnecting from database...');
      await mongoose.disconnect();
      this.logger.info('Database connection closed.');
    }
  }
}
