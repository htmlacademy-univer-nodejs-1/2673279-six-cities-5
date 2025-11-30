import { Container } from 'inversify';
import { RestApplication } from './index.js';
import { Component } from '../shared/types/index.js';
import { Logger, PinoLogger } from '../shared/libs/logger/index.js';
import { Config, RestConfig, RestSchema } from '../shared/libs/config/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { AppExceptionFilter, ExceptionFilter } from '../shared/libs/rest/index.js';

export function createRestApplicationContainer() {
  const restContainer = new Container();

  restContainer.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  restContainer.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  restContainer.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  restContainer.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  restContainer.bind<ExceptionFilter>(Component.ExceptionFilter).to(AppExceptionFilter).inSingletonScope();

  return restContainer;
}
