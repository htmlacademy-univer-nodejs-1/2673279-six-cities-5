import mongoose, { Mongoose } from 'mongoose';
import { DatabaseClient } from './database-client.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../logger/index.js';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongooseInstance: Mongoose | null = null;
  private isConnectedFlag: boolean = false; 

  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {}

  public isConnected(): boolean {
    return this.isConnectedFlag;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnected()) {
      throw new Error('MongoDB client already connected.');
    }

    this.logger.info('Trying to connect to MongoDB...');
    this.mongooseInstance = await mongoose.connect(uri);
    this.isConnectedFlag = true; 
    this.logger.info('Database connection established.');
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected()) {
      throw new Error('Not connected to the database – nothing to disconnect.'); 
    }

    await this.mongooseInstance?.disconnect?.();
    this.isConnectedFlag = false; 
    this.mongooseInstance = null;
    this.logger.info('Database connection closed.');
  }
}