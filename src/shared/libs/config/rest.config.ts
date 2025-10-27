import { injectable, inject } from 'inversify';
import { config } from 'dotenv';
import { Logger } from '../logger/index.js';
import { Config } from './config.interface.js';
import { restSchema, RestSchema } from './rest.schema.js';
import { Component } from '../../types/index.js';
import type { Config as ConvictConfig } from 'convict';

@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly config: ConvictConfig<RestSchema>;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exist.');
    }

    this.config = restSchema;
    this.config.load({});
    this.config.validate({ allowed: 'strict', output: (message) => this.logger.info(message) });

    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config.get(key) as RestSchema[T];
  }
}
