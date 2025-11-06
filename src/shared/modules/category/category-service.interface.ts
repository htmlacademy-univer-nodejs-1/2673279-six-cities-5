import { DocumentType } from '@typegoose/typegoose';
import { CategoryEntity } from './category.entity.js';
import { CreateCategoryDto } from './dto/index.js';

export interface CategoryService {
  create(dto: CreateCategoryDto): Promise<DocumentType<CategoryEntity>>;
  findByCategoryId(categoryId: string): Promise<DocumentType<CategoryEntity> | null>;
  findByCategoryName(categoryName: string): Promise<DocumentType<CategoryEntity> | null>;
  findOrCreate(dto: CreateCategoryDto): Promise<DocumentType<CategoryEntity>>;
  find(): Promise<DocumentType<CategoryEntity>[]>;
}
