import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(__dirname, 'tiling-layout-scrollbar.css'), 'utf8');
const indexSource = readFileSync(resolve(__dirname, 'index.tsx'), 'utf8');

function ruleBody(selector: string): string {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`));
  if (!match) throw new Error(`Missing CSS rule for ${selector}`);
  return match[1] ?? '';
}

function pxValue(rule: string, property: string): number {
  const match = rule.match(new RegExp(`${property}:\\s*(\\d+)px`));
  if (!match) throw new Error(`Missing ${property} pixel value`);
  return Number(match[1]);
}

describe('tiling layout scrollbar styles', () => {
  it('keeps the scrollbar easy to grab and outside the resize hit target', () => {
    expect(indexSource).toContain("import './tiling-layout-scrollbar.css';");

    const stripRule = ruleBody('.tiling-layout-strip');
    const scrollbarRule = ruleBody('.tiling-layout-strip::-webkit-scrollbar');
    const handleRule = ruleBody('.tiling-layout-strip > div > .resize-handle-h');

    expect(stripRule).toMatch(/scrollbar-width:\s*auto/);

    const scrollbarHeight = pxValue(scrollbarRule, 'height');
    const handleClearance = pxValue(handleRule, 'margin-bottom');

    expect(scrollbarHeight).toBeGreaterThan(5);
    expect(handleClearance).toBeGreaterThanOrEqual(scrollbarHeight);
  });
});
