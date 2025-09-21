#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { Offer } from './types/offer.type.js';
import { City } from './types/city.type.js';
import { HousingType } from './types/housing-type.enum.js';
import { Goods } from './types/goods.enum.js';
import { resolve } from 'node:path';
import chalk from 'chalk';

function showHelp(): void {
  console.log(`
    ${chalk.bold.inverse('Программа для подготовки данных для REST API сервера.')}
    ${chalk.yellow('Пример:')}
        cli.js --<command> [--arguments]
    ${chalk.yellow('Команды:')}
        ${chalk.green('--version:')}                   # выводит номер версии
        ${chalk.green('--help:')}                      # печатает этот текст
        ${chalk.green('--import <path>:')}             # импортирует данные из TSV
  `);
}

function showVersion(): void {
  const packageJsonPath = resolve(process.cwd(), 'package.json');
  const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
  const { version } = JSON.parse(packageJsonContent);
  console.log(version);
}

function importData(filepath: string): void {
  const absoluteFilepath = resolve(process.cwd(), filepath);
  try {
    const fileContent = readFileSync(absoluteFilepath, 'utf-8');
    const offers = parseOffers(fileContent);
    console.log(offers);
  } catch (error) {
    console.error(chalk.red(`Не удалось импортировать данные из файла по пути: ${absoluteFilepath}`));
    console.error(chalk.red(`Ошибка: ${(error as Error).message}`));
  }
}

function parseOffers(fileContent: string): Offer[] {
  return fileContent
    .split('\n')
    .slice(1)
    .filter((line) => line.trim() !== '')
    .map((line) => {
      const [
        title, description, postDate, city, previewImage, images,
        isPremium, isFavorite, rating, type, bedrooms, maxAdults,
        price, goods, hostName, hostEmail, hostAvatar, hostType,
        latitude, longitude
      ] = line.split('\t');

      return {
        title,
        description,
        postDate: new Date(postDate),
        city: city as City,
        previewImage,
        images: images.split(';'),
        isPremium: isPremium === 'да',
        isFavorite: isFavorite === 'да',
        rating: Number.parseFloat(rating),
        type: type as HousingType,
        bedrooms: Number.parseInt(bedrooms, 10),
        maxAdults: Number.parseInt(maxAdults, 10),
        price: Number.parseInt(price, 10),
        goods: goods.split(';') as Goods[],
        host: {
          name: hostName,
          email: hostEmail,
          avatarUrl: hostAvatar,
          type: hostType as 'обычный' | 'pro',
        },
        commentsCount: 0,
        coordinates: {
          latitude: Number.parseFloat(latitude),
          longitude: Number.parseFloat(longitude),
        },
      };
    });
}

const [,, command, ...args] = process.argv;

if (!command || command === '--help') {
  showHelp();
} else if (command === '--version') {
  showVersion();
} else if (command === '--import') {
  const [filepath] = args;
  if (!filepath) {
    console.error('Не указан путь к файлу. Пример: --import ./mocks/test.tsv');
  } else {
    importData(filepath);
  }
} else {
  console.log(`Неизвестная команда "${command}". Для списка команд введите --help.`);
}
