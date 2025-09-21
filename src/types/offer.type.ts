import { User } from './user.type.js';
import { HousingType } from './housing-type.enum.js';
import { City } from './city.type.js';
import { Goods } from './goods.enum.js';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HousingType;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: Goods[];
  host: User;
  commentsCount: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};
