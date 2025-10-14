import { Offer } from './offer.type.js';

export type MockOffer = Omit<Offer, 'commentsCount' | 'isFavorite'>;
