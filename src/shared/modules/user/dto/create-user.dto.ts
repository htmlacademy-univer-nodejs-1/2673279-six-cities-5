import { IsEmail, IsEnum, IsString, Length, IsOptional } from 'class-validator';
import { UserType } from '../../../types/index.js';
import { CreateUserValidationMessage } from './create-user.messages.js';

export class CreateUserDto {
  @IsString({ message: CreateUserValidationMessage.name.required })
  @Length(1, 15, { message: CreateUserValidationMessage.name.length })
  public name!: string;

  @IsEmail({}, { message: CreateUserValidationMessage.email.invalidFormat })
  public email!: string;

  @IsOptional()
  @IsString({ message: CreateUserValidationMessage.avatarUrl.invalidFormat })
  public avatarUrl?: string;

  @IsString({ message: CreateUserValidationMessage.password.required })
  @Length(6, 12, { message: CreateUserValidationMessage.password.length })
  public password!: string;

  @IsEnum(['обычный', 'pro'], { message: CreateUserValidationMessage.type.invalidFormat })
  public type!: UserType;
}
