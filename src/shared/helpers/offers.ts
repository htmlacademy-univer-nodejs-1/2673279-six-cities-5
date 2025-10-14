import { Offer, City, HousingType, Goods, User } from '../types/index.js';

export function createOffer(tsvRow: string): Offer {
  const [
    title, description, postDate, city, previewImage, images,
    isPremium, isFavorite, rating, type, bedrooms, maxAdults,
    price, goods, hostName, hostEmail, hostAvatar, hostType,
    latitude, longitude
  ] = tsvRow.replace('\n', '').split('\t');

  const host: User = { name: hostName, email: hostEmail, avatarUrl: hostAvatar, type: hostType as 'обычный' | 'pro' };

  return {
    title, description, postDate: new Date(postDate), city: city as City,
    previewImage, images: images.split(';'), isPremium: isPremium === 'да',
    isFavorite: isFavorite === 'да', rating: Number.parseFloat(rating), type: type as HousingType,
    bedrooms: Number.parseInt(bedrooms, 10), maxAdults: Number.parseInt(maxAdults, 10),
    price: Number.parseInt(price, 10), goods: goods.split(';') as Goods[], host,
    commentsCount: 0,
    coordinates: { latitude: Number.parseFloat(latitude), longitude: Number.parseFloat(longitude) },
  };
}
