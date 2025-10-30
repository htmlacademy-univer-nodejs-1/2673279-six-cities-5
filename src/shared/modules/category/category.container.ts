import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { CategoryService } from './category-service.interface.js';
import { DefaultCategoryService } from './default-category.service.js';
import { CategoryEntity, CategoryModel } from './category.entity.js';
import { Component } from '../../types/index.js';

export function createCategoryContainer() {
  const categoryContainer = new Container();

  categoryContainer.bind<CategoryService>(Component.CategoryService).to(DefaultCategoryService).inSingletonScope();
  categoryContainer.bind<types.ModelType<CategoryEntity>>(Component.CategoryModel).toConstantValue(CategoryModel as any);

  return categoryContainer;
}
