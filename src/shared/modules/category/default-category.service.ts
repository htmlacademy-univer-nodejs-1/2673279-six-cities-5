import { CategoryEntity } from './category.entity.js';
import { CreateCategoryDto } from './dto/index.js';
import { CategoryService } from './category-service.interface.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { injectable, inject } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

@injectable()
export class DefaultCategoryService implements CategoryService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CategoryModel) private readonly categoryModel: types.ModelType<CategoryEntity>
  ) {}

  public async create(dto: CreateCategoryDto): Promise<DocumentType<CategoryEntity>> {
    const result = await this.categoryModel.create(dto);
    this.logger.info(`New category created: ${dto.name}`);
    return result as unknown as DocumentType<CategoryEntity>;
  }

  public async findByCategoryId(categoryId: string): Promise<DocumentType<CategoryEntity> | null> {
    return this.categoryModel.findById(categoryId).exec() as unknown as DocumentType<CategoryEntity> | null;
  }

  public async findByCategoryName(categoryName: string): Promise<DocumentType<CategoryEntity> | null> {
    return this.categoryModel.findOne({name: categoryName}).exec() as unknown as DocumentType<CategoryEntity> | null;
  }

  public async findOrCreate(dto: CreateCategoryDto): Promise<DocumentType<CategoryEntity>> {
    const existedCategory = await this.findByCategoryName(dto.name);
    if (existedCategory) {
      return existedCategory;
    }
    return this.create(dto);
  }

  public async find(): Promise<DocumentType<CategoryEntity>[]> {
    return this.categoryModel.find().exec() as unknown as DocumentType<CategoryEntity>[];
  }
}
