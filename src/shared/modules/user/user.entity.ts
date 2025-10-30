import { prop, getModelForClass, modelOptions, defaultClasses } from '@typegoose/typegoose';
import { User, UserType } from '../../types/index.js';
import { hash, compare } from 'bcrypt';
import { CreateUserDto } from './dto/index.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true, trim: true, minlength: 1, maxlength: 15 })
  public name!: string;

  @prop({ required: true, unique: true, trim: true, match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'] })
  public email!: string;

  @prop({ default: '' })
  public avatarUrl!: string;

  @prop({ required: true, type: () => String, enum: ['обычный', 'pro'] })
  public type!: UserType;

  @prop({ required: true, trim: true, private: true })
  private password?: string;

  constructor(userData: CreateUserDto) {
    super();
    this.name = userData.name;
    this.email = userData.email;
    this.avatarUrl = userData.avatarUrl ?? '';
    this.type = userData.type;
  }

  public async setPassword(password: string, salt: string): Promise<void> {
    this.password = await hash(password, salt);
  }

  public async verifyPassword(password: string, salt: string): Promise<boolean> {
    const hashedPassword = await hash(password, salt);
    return await compare(password, hashedPassword);
  }

  public getPassword() {
    return this.password;
  }

}

export const UserModel = getModelForClass(UserEntity);
