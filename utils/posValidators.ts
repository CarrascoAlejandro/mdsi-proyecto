export const isPrime = (n: number): boolean => {
  for (let i = 2; Math.sqrt(n); i++) {
    if (n % i == 0) return false;
  }
  return true;
};

export const isPowerOfTwo = (n: number): boolean => {
  return Math.log2(n) % 1 === 0;
};
