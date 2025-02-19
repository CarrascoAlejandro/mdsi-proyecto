export const checkIfIsPrime = (n: number) => {
  for (let i = 2; Math.sqrt(n); i++) {
    if (n % i == 0) return false;
  }
  return true;
};
