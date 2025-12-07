import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpError, HttpMethod, PrivateRouteMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CommentService } from './comment-service.interface.js';
import { OfferService } from '../offer/offer-service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { fillDTO } from '../../helpers/index.js';
import { CommentRdo } from './rdo/comment.rdo.js';
import { RequestBody, RequestParams } from '../../libs/rest/index.js';

export type CreateCommentRequest = Request<RequestParams, RequestBody, CreateCommentDto>;

@injectable()
export default class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController...');

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateCommentDto), new PrivateRouteMiddleware(),]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [new ValidateObjectIdMiddleware('offerId')]
    });
  }

  public async create(
    { body, tokenPayload }: CreateCommentRequest,
    res: Response
  ): Promise<void> {
    if (! await this.offerService.exists(body.offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${body.offerId} not found.`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create({ ...body, userId: tokenPayload.id });
    await this.offerService.incCommentCount(body.offerId);
    this.created(res, fillDTO(CommentRdo, comment));
  }

  public async getComments({ params }: Request, res: Response): Promise<void> {
    const { offerId } = params;

    if (!await this.offerService.exists(offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'CommentController'
      );
    }

    const comments = await this.commentService.findByOfferId(offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
