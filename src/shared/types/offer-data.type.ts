import { CreateUserDto } from '../modules/user/dto/index.js';
import { City, Goods, HousingType } from './index.js';

export type OfferData = {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  rating: number;
  type: HousingType;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: Goods[];
  host: Omit<CreateUserDto, 'password'> & { type: 'обычный' | 'pro', password?: string };
  coordinates: { latitude: number; longitude: number; };
};
