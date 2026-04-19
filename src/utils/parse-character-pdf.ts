import type { HeroStats } from '@/types';

export interface ParsedCharacterSheet {
  name: string | null;
  race: string | null;
  class: string | null;
  level: number | null;
  playerName: string | null;
  hp: number | null;
  ac: number | null;
  speed: string | null;
  stats: HeroStats | null;
  backstory: string | null;
}

/**
 * Extract text from a PDF file and attempt to parse D&D 5e character sheet fields.
 * Lazily loads pdfjs-dist at call time so it only runs in a browser context.
 */
export async function parseCharacterPdf(fileUri: string): Promise<ParsedCharacterSheet> {
  // Dynamic import — only loaded when the user actually triggers an import
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const pdf = await pdfjsLib.getDocument(fileUri).promise;
  const allText: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items
      .filter((item): item is { str: string } => 'str' in item)
      .map((item) => item.str);
    allText.push(...strings);
  }

  const text = allText.join('\n');

  return {
    name: extractField(text, /Character\s*Name[:\s]*(.+)/i)
      ?? extractField(text, /^([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)\s*$/m),
    race: extractField(text, /\bRace[:\s]*(.+)/i),
    class: extractField(text, /\bClass(?:\s*&\s*Level)?[:\s]*(.+)/i)
      ?? extractField(text, /\bClass[:\s]*(.+)/i),
    level: extractNumber(text, /Level[:\s]*(\d+)/i)
      ?? extractClassLevel(text),
    playerName: extractField(text, /Player\s*(?:Name)?[:\s]*(.+)/i),
    hp: extractNumber(text, /(?:Hit\s*Points|HP|Max\s*HP)[:\s]*(\d+)/i)
      ?? extractNumber(text, /(\d+)\s*(?:Hit\s*Points|HP)/i),
    ac: extractNumber(text, /(?:Armor\s*Class|AC)[:\s]*(\d+)/i)
      ?? extractNumber(text, /(\d+)\s*(?:Armor\s*Class|AC)/i),
    speed: extractField(text, /Speed[:\s]*([\d]+\s*ft\.?)/i),
    stats: extractStats(text),
    backstory: extractField(text, /(?:Backstory|Background|Character\s*Backstory)[:\s]*(.{10,})/i),
  };
}

function extractField(text: string, pattern: RegExp): string | null {
  const match = text.match(pattern);
  if (!match?.[1]) return null;
  const value = match[1].trim();
  return value.length > 0 ? value : null;
}

function extractNumber(text: string, pattern: RegExp): number | null {
  const match = text.match(pattern);
  if (!match?.[1]) return null;
  const num = parseInt(match[1], 10);
  return isNaN(num) ? null : num;
}

function extractClassLevel(text: string): number | null {
  const match = text.match(/(?:Barbarian|Bard|Cleric|Druid|Fighter|Monk|Paladin|Ranger|Rogue|Sorcerer|Warlock|Wizard)\s+(\d+)/i);
  if (match?.[1]) return parseInt(match[1], 10);
  return null;
}

function extractStats(text: string): HeroStats | null {
  const stats: HeroStats = {
    strength: null,
    dexterity: null,
    constitution: null,
    intelligence: null,
    wisdom: null,
    charisma: null,
  };

  const patterns: [keyof HeroStats, RegExp][] = [
    ['strength', /(?:STR|Strength)[:\s]*(\d+)/i],
    ['dexterity', /(?:DEX|Dexterity)[:\s]*(\d+)/i],
    ['constitution', /(?:CON|Constitution)[:\s]*(\d+)/i],
    ['intelligence', /(?:INT|Intelligence)[:\s]*(\d+)/i],
    ['wisdom', /(?:WIS|Wisdom)[:\s]*(\d+)/i],
    ['charisma', /(?:CHA|Charisma)[:\s]*(\d+)/i],
  ];

  let found = false;
  for (const [key, pattern] of patterns) {
    const val = extractNumber(text, pattern);
    if (val !== null) {
      stats[key] = val;
      found = true;
    }
  }

  return found ? stats : null;
}
