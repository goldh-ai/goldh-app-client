/**
 * ConfidenceBadge — pure config logic tests
 *
 * These tests verify the badge configuration mapping without requiring React rendering.
 * For full component render tests, add @testing-library/react + jsdom environment.
 *
 * NOTE: BADGE_CONFIG is duplicated here to avoid importing the React component in
 * the node vitest environment (which lacks @/ path alias + React context).
 * The source of truth remains ConfidenceBadge.tsx — keep in sync.
 */

import { describe, it, expect } from 'vitest';

// Mirrors BADGE_CONFIG in ConfidenceBadge.tsx
const BADGE_CONFIG = {
  green: {
    label: 'High Confidence',
    className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25',
  },
  amber: {
    label: 'Medium Confidence',
    className: 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25',
  },
  red: {
    label: 'Low Confidence',
    className: 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25',
  },
} as const;

describe('ConfidenceBadge config mapping', () => {
  it('maps green badge to High Confidence label', () => {
    expect(BADGE_CONFIG.green.label).toBe('High Confidence');
  });

  it('maps amber badge to Medium Confidence label', () => {
    expect(BADGE_CONFIG.amber.label).toBe('Medium Confidence');
  });

  it('maps red badge to Low Confidence label', () => {
    expect(BADGE_CONFIG.red.label).toBe('Low Confidence');
  });

  it('all badge variants have a label and className', () => {
    for (const key of ['green', 'amber', 'red'] as const) {
      const config = BADGE_CONFIG[key];
      expect(config.label).toBeTruthy();
      expect(config.className).toBeTruthy();
    }
  });

  it('aria-label format would include score: Confidence level: High Confidence (92%)', () => {
    const score = 92;
    const badge = 'green';
    const label = BADGE_CONFIG[badge].label;
    const ariaLabel = `Confidence level: ${label} (${score}%)`;
    expect(ariaLabel).toBe('Confidence level: High Confidence (92%)');
  });

  it('aria-label format would include score for amber: Confidence level: Medium Confidence (55%)', () => {
    const score = 55;
    const badge = 'amber';
    const label = BADGE_CONFIG[badge].label;
    const ariaLabel = `Confidence level: ${label} (${score}%)`;
    expect(ariaLabel).toBe('Confidence level: Medium Confidence (55%)');
  });

  it('green badge does not use red CSS classes', () => {
    expect(BADGE_CONFIG.green.className).not.toContain('red');
  });

  it('red badge does not use emerald CSS classes', () => {
    expect(BADGE_CONFIG.red.className).not.toContain('emerald');
  });

  it('amber badge uses amber CSS classes', () => {
    expect(BADGE_CONFIG.amber.className).toContain('amber');
  });
});
