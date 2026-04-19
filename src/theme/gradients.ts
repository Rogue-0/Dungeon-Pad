export const GRADIENT_PALETTES = [
  ['#C4A882', '#8B7355', '#6B5740'],
  ['#7B8F8A', '#4F6962', '#3A4F4A'],
  ['#8E7BA4', '#5E4D6E', '#443658'],
  ['#A4816B', '#7A5C4A', '#5C3F33'],
  ['#6B8CA4', '#4A6B82', '#334D5E'],
  ['#9B8B6E', '#6E6350', '#4D4538'],
] as const;

export function paletteForId(id: string) {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return GRADIENT_PALETTES[sum % GRADIENT_PALETTES.length];
}

export function paletteByIndex(index: number) {
  return GRADIENT_PALETTES[index % GRADIENT_PALETTES.length];
}
