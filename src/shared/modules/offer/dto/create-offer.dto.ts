import {
  IsArray,
  IsDateString,
  IsEnum,
  IsBoolean,
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { City, Goods, HousingType } from '../../../types/index.js';
import { CreateOfferValidationMessage } from './create-offer.messages.js';

export class CreateOfferCoordinatesDto {
  @IsInt()
  public latitude!: number;

  @IsInt()
  public longitude!: number;
}

export class CreateOfferDto {
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  public title!: string;

  @MinLength(20, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateOfferValidationMessage.description.maxLength })
  public description!: string;

  @IsDateString({}, { message: CreateOfferValidationMessage.postDate.invalidFormat })
  public postDate!: Date;

  @IsEnum(City, { message: CreateOfferValidationMessage.city.invalid })
  public city!: City;

  @IsString({ message: CreateOfferValidationMessage.previewImage.required })
  public previewImage!: string;

  @IsArray({ message: CreateOfferValidationMessage.images.invalidFormat })
  @ArrayMinSize(6, { message: CreateOfferValidationMessage.images.invalidSize })
  @ArrayMaxSize(6, { message: CreateOfferValidationMessage.images.invalidSize })
  public images!: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium!: boolean;

  @IsEnum(HousingType, { message: CreateOfferValidationMessage.type.invalid })
  public type!: HousingType;

  @IsInt({ message: CreateOfferValidationMessage.bedrooms.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.bedrooms.minValue })
  @Max(8, { message: CreateOfferValidationMessage.bedrooms.maxValue })
  public bedrooms!: number;

  @IsInt({ message: CreateOfferValidationMessage.maxAdults.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.maxAdults.minValue })
  @Max(10, { message: CreateOfferValidationMessage.maxAdults.maxValue })
  public maxAdults!: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.price.maxValue })
  public price!: number;

  @IsArray({ message: CreateOfferValidationMessage.goods.invalidFormat })
  @IsEnum(Goods, { each: true, message: CreateOfferValidationMessage.goods.invalidItems })
  @ArrayMinSize(1, { message: CreateOfferValidationMessage.goods.minSize })
  public goods!: Goods[];

  @IsString({ message: CreateOfferValidationMessage.host.invalidId })
  public host!: string;

  @ValidateNested()
  @Type(() => CreateOfferCoordinatesDto)
  public coordinates!: CreateOfferCoordinatesDto;

  public userId!: string;
}
