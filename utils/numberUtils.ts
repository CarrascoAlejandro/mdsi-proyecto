export function extractCenterDigits(N: number, D: number): string {
  let numStr = N.toString();
  let totalLength = Math.max(numStr.length, D); // Ensure the number is at least D digits long

  // Pad with leading zeros if necessary
  numStr = numStr.padStart(totalLength, '0');

  let start = Math.floor((totalLength - D) / 2); // Find the center start index
  return numStr.substring(start, start + D);
}

// Example usage:
//console.log(extractCenterDigits(4547883844, 5)); // "2345"
//console.log(extractCenterDigits(98765, 3)); // "876"
//console.log(extractCenterDigits(1, 3)); // "001"
//console.log(extractCenterDigits(123456789, 6)); // "345678"

export function areBothEvenOdd(a: number, b: number): boolean {
  return (a % 2 == 0 && b % 2 == 0) || (a % 2 != 0 && b % 2 != 0);
}

export function nextPowerOfTwo(n: number): number {
  if (n <= 1) return 1;
  console.log(`util: n = ${n}; log2n = ${Math.log2(n)}`);
  return Math.pow(2, Math.ceil(Math.log2(n)));
}
