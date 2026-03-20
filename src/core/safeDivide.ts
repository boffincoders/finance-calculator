
export function safeDivide(n: number, d: number): number | null {
  if (!d || d === 0) return null;
  return n / d;
}
