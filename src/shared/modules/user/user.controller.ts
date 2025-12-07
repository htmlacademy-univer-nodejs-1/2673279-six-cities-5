import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpError, HttpMethod, UploadFileMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserService } from './user-service.interface.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { StatusCodes } from 'http-status-codes';
import { RequestBody, RequestParams } from '../../libs/rest/index.js';
import { LoginUserDto } from './dto/index.js';
import { AuthService } from '../auth/index.js';
import { LoggedUserRdo } from './rdo/logged-user.rdo.js';
import { fillDTO } from '../../helpers/common.js';
import { UserRdo } from './rdo/user.rdo.js';

export type LoginUserRequest = Request<RequestParams, RequestBody, LoginUserDto>;


@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController...');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      this.send(res, StatusCodes.CONFLICT, { error: 'User exists' });
      return;
    }

    const salt = this.configService.get('SALT');
    if (!salt) {
      this.send(res, StatusCodes.INTERNAL_SERVER_ERROR, { error: 'Salt not set in configuration' });
      return;
    }
    const result = await this.userService.create(body, salt);
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(
    { body }: LoginUserRequest,
    res: Response,
  ): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, {
      email: user.email,
      token,
    });
    this.ok(res, responseData);
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }

  public async checkAuthenticate({ tokenPayload: { email }}: Request, res: Response) {
    const foundedUser = await this.userService.findByEmail(email);

    if (! foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(LoggedUserRdo, foundedUser));
  }
}
