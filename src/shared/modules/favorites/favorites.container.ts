import {Container} from 'inversify';
import {FavoriteService} from './favorite-service.interface.js';
import {Component} from '../../types/component.enum.js';
import {DefaultFavoriteService} from './default-favorite-service.js';
import {types} from '@typegoose/typegoose';
import {FavoriteEntity, FavoriteModel} from './favorite.entity.js';
import { Controller } from '../../libs/rest/controller/controller.interface.js';
import { FavoritesController } from './favorite.controller.js';

export function createFavoritesContainer () {
  const container = new Container();

  container.bind<FavoriteService>(Component.FavoriteService).to(DefaultFavoriteService).inSingletonScope();
  container.bind<types.ModelType<FavoriteEntity>>(Component.FavoriteModel).toConstantValue(FavoriteModel);
  container.bind<Controller>(Component.FavoritesController).to(FavoritesController).inSingletonScope();

  return container;
}
