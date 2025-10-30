import { prop, getModelForClass, modelOptions, defaultClasses } from '@typegoose/typegoose';
import { Category } from '../../types/index.js';

export interface CategoryEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'categories',
    timestamps: true,
  }
})
export class CategoryEntity extends defaultClasses.TimeStamps implements Category {
  @prop({ required: true, trim: true, unique: true })
  public name!: string;
}

export const CategoryModel = getModelForClass(CategoryEntity);
