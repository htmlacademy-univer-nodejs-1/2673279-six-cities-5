import { prop, getModelForClass, modelOptions, defaultClasses, Ref } from '@typegoose/typegoose';
import { Offer, City, Goods, HousingType, Location } from '../../types/index.js';
import { UserEntity } from '../user/user.entity.js';


const GoodsValues = Object.values(Goods);
const HousingTypeValues = Object.values(HousingType);

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})
export class OfferEntity extends defaultClasses.TimeStamps implements Omit<Offer, 'host'> {

  @prop({ required: true, minlength: 10, maxlength: 100, trim: true })
  public title!: string;

  @prop({ required: true, minlength: 20, maxlength: 1024, trim: true })
  public description!: string;

  @prop({ required: true })
  public postDate!: Date;

  @prop({ required: true, enum: City, type: () => String })
  public city!: City;

  @prop({ required: true, trim: true })
  public previewImage!: string;

  @prop({ required: true, type: () => [String], validate: [(v: string[]) => v.length === 6, 'Should be 6 images'] })
  public images!: string[];

  @prop({ required: true, default: false })
  public isPremium!: boolean;

  @prop({ required: true, min: 1, max: 5, default: 1 })
  public rating!: number;

  @prop({ required: true, enum: HousingTypeValues })
  public type!: HousingType;

  @prop({ required: true, min: 1, max: 8 })
  public bedrooms!: number;

  @prop({ required: true, min: 1, max: 10 })
  public maxAdults!: number;

  @prop({ required: true, min: 100, max: 100000 })
  public price!: number;

  @prop({ required: true, type: () => [String], enum: GoodsValues })
  public goods!: Goods[];

  @prop({
    ref: () => UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({ required: true, _id: false })
  public coordinates!: Location;

  @prop({ default: 0 })
  public commentsCount!: number;
}

export const OfferModel = getModelForClass(OfferEntity);
