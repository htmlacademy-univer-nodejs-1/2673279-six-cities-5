import { injectable, inject } from 'inversify';
import { types, DocumentType }from '@typegoose/typegoose';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CommentModel, CommentEntity } from '../comment/comment.entity.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${result.title} (ID: ${result.id})`);
    return result as unknown as DocumentType<OfferEntity>;
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel
      .findByIdAndUpdate(offerId, { $inc: { commentsCount: 1 } }, { new: true })
      .exec() as DocumentType<OfferEntity> | null;
    return result;
  }

  public async updateRating(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const comments = await CommentModel.find({ offerId }) ;
    if (comments.length === 0) {
      return await this.offerModel
        .findByIdAndUpdate(offerId, { rating: 0 }, { new: true })
        .exec() as DocumentType<OfferEntity> | null;
    }

    let sumRating = 0;
    for (const comment of comments) {
      sumRating += comment.rating;
    }
    const newRating = sumRating / comments.length;

    const result = await this.offerModel
      .findByIdAndUpdate(offerId, { rating: newRating }, { new: true })
      .exec() as DocumentType<OfferEntity> | null;
    return result;
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }
}
