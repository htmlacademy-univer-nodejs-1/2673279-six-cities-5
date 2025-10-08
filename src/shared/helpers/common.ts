export function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function getRandomNumber(min: number, max: number, numAfterDigit = 0) {
  const lowerBound = Math.min(min, max);
  const upperBound = Math.max(min, max);
  return +(Math.random() * (upperBound - lowerBound) + lowerBound).toFixed(numAfterDigit);
}
