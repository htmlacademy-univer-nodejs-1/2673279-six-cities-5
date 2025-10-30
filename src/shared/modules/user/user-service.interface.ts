import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/index.js';

export interface UserService {
  /**
   * @param dto
   * @param salt
   */
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;

  /**
   * @param email
   */
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;

  /**
   * @param dto
   * @param salt
   */
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
}
