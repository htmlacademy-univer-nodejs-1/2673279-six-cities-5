import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/index.js';
import { UserService } from './user-service.interface.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { injectable, inject } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const tempUser = new UserEntity(dto);
    await tempUser.setPassword(dto.password, salt);

    const result = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      avatarUrl: dto.avatarUrl ?? '',
      type: dto.type,
      password: tempUser.getPassword()
    });

    this.logger.info(`New user created: ${result.email}`);
    return result as unknown as DocumentType<UserEntity>;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email}).exec() as unknown as DocumentType<UserEntity>;
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);
    if (existedUser) {
      return existedUser;
    }
    return this.create(dto, salt);
  }
}
