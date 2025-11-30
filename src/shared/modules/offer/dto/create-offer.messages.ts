export const CreateOfferValidationMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  postDate: {
    invalidFormat: 'postDate must be a valid ISO date',
  },
  city: {
    invalid: 'city must be one of: Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf',
  },
  previewImage: {
    required: 'previewImage is required',
  },
  images: {
    invalidFormat: 'Field images must be an array',
    invalidSize: 'Images array must contain exactly 6 images',
  },
  isPremium: {
    invalidFormat: 'isPremium must be a boolean',
  },
  type: {
    invalid: 'type must be one of: apartment, house, room, hotel',
  },
  bedrooms: {
    invalidFormat: 'Bedrooms must be an integer',
    minValue: 'Minimum bedrooms is 1',
    maxValue: 'Maximum bedrooms is 8',
  },
  maxAdults: {
    invalidFormat: 'maxAdults must be an integer',
    minValue: 'Minimum maxAdults is 1',
    maxValue: 'Maximum maxAdults is 10',
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 100000',
  },
  goods: {
    invalidFormat: 'Field goods must be an array',
    invalidItems: 'goods must be valid values',
    minSize: 'Minimum goods is 1',
  },
  host: {
    invalidId: 'host field must be a valid id',
  },
} as const;
