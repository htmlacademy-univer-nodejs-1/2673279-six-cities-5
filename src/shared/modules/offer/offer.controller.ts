import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferService } from './offer-service.interface.js';
import { HttpMethod } from '../../libs/rest/types/http-method.enum.js';
import { fillDTO } from '../../helpers/common.js';
import { OfferRdo } from './rdo/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { ValidateObjectIdMiddleware } from '../../libs/rest/index.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.show, middlewares: [new ValidateObjectIdMiddleware('offerId')] });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete, middlewares: [new ValidateObjectIdMiddleware('offerId')] });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update, middlewares: [new ValidateObjectIdMiddleware('offerId')] });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create({ body }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>, res: Response): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRdo, result));
  }

  public async show({ params }: Request, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);
    if (!offer) {
      res.status(404).send({ error: 'Offer not found' });
      return;
    }
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async delete({ params }: Request, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);

    if (!offer) {
      res.status(404).send({ error: 'Offer not found' });
      return;
    }

    this.noContent(res, offer);
  }

  public async update({ params, body }: Request, res: Response): Promise<void> {
    const { offerId } = params;
    const updatedOffer = await this.offerService.updateById(offerId, body as UpdateOfferDto);

    if (!updatedOffer) {
      res.status(404).send({ error: 'Offer not found' });
      return;
    }

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async getPremium({ params }: Request, res: Response): Promise<void> {
    const { city } = params;
    const offers = await this.offerService.findPremiumByCity(city);
    this.ok(res, fillDTO(OfferRdo, offers));
  }
}
