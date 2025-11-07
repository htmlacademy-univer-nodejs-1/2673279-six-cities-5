import { DocumentType, types } from '@typegoose/typegoose';
import { injectable, inject } from 'inversify';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { Component } from '../../types/index.js';
import { CommentService } from './comment-service.interface.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    return comment as unknown as DocumentType<CommentEntity>;
  }

  public async findByOfferId(
    offerId: string,
    count?: number
  ): Promise<DocumentType<CommentEntity>[]> {
    const limit = count ?? 50;
    const sortType = -1;
    const findQuery = this.commentModel
      .find({ offerId })
      .limit(limit)
      .sort({ createdAt: sortType })
      .exec();
    return findQuery as unknown as DocumentType<CommentEntity>[];
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({ offerId })
      .exec();
    return result.deletedCount;
  }
}
