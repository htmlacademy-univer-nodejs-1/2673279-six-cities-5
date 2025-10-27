import convict from 'convict';

export interface RestSchema {
  PORT: number;
  SALT: string;
  DB_HOST: string;
}

export const restSchema = convict<RestSchema>({
  PORT: {
    doc: 'Порт для входящих соединений',
    format: 'port',
    env: 'PORT',
    default: 4000
  },
  SALT: {
    doc: 'Соль для хеширования паролей',
    format: String,
    env: 'SALT',
    default: null
  },
  DB_HOST: {
    doc: 'Хост базы данных',
    format: String,
    env: 'DB_HOST',
    default: 'localhost'
  }
});
