export function getMongoURI(
  username?: string,
  password?: string,
  host?: string,
  port?: number,
  databaseName?: string
): string {
  const credentials = (username && password) ? `${username}:${password}@` : '';
  return `mongodb://${credentials}${host}:${port}/${databaseName}?authSource=admin`;
}
