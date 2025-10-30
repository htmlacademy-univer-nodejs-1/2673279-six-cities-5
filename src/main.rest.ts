import 'reflect-metadata';
import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { RestApplication } from './rest/index.js';
import { Component } from './shared/types/index.js';

import { Logger, PinoLogger } from './shared/libs/logger/index.js';
import { Config, RestConfig, RestSchema } from './shared/libs/config/index.js';
import { DatabaseClient, MongoDatabaseClient } from './shared/libs/database-client/index.js';

import { UserEntity, UserModel } from './shared/modules/user/index.js';
import { UserService, DefaultUserService } from './shared/modules/user/index.js';
import { CategoryEntity, CategoryModel } from './shared/modules/category/index.js';
import { CategoryService, DefaultCategoryService } from './shared/modules/category/index.js';

async function bootstrap() {
  const appContainer = new Container();
  appContainer.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  appContainer.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  appContainer.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  appContainer.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();

  appContainer.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  appContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel as any);

  appContainer.bind<CategoryService>(Component.CategoryService).to(DefaultCategoryService).inSingletonScope();
  appContainer.bind<types.ModelType<CategoryEntity>>(Component.CategoryModel).toConstantValue(CategoryModel as any);

  const application = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
