import { describe, it, expect } from 'vitest';
import {
  getTrackCode,
  parseRegistrationSequence,
  formatRegistrationId,
  generateNextRegistrationId,
} from '../src/lib/db/id-generator';

describe('Registration ID Generator', () => {
  it('maps track IDs to standard track codes', () => {
    expect(getTrackCode('track-ai-ml')).toBe('AIML');
    expect(getTrackCode('track-web-dev')).toBe('WEB');
    expect(getTrackCode('track-app-dev')).toBe('APP');
    expect(getTrackCode('unknown-track')).toBe('GEN');
    expect(getTrackCode(null)).toBe('GEN');
    expect(getTrackCode('')).toBe('GEN');
  });

  it('formats registration IDs with zero-padding', () => {
    expect(formatRegistrationId('track-ai-ml', 1)).toBe('SK27-AIML-0001');
    expect(formatRegistrationId('track-web-dev', 42)).toBe('SK27-WEB-0042');
    expect(formatRegistrationId('track-app-dev', 999)).toBe('SK27-APP-0999');
    expect(formatRegistrationId('track-ai-ml', 1000)).toBe('SK27-AIML-1000');
  });

  it('parses registration sequence numbers correctly', () => {
    expect(parseRegistrationSequence('SK27-AIML-0001')).toBe(1);
    expect(parseRegistrationSequence('SK27-WEB-0042')).toBe(42);
    expect(parseRegistrationSequence('SK27-0105')).toBe(105);
    expect(parseRegistrationSequence('team_12345678')).toBe(null);
    expect(parseRegistrationSequence('60d5062b-0a38-4bfd-9b49-f1ab4b23df53')).toBe(null);
    expect(parseRegistrationSequence('')).toBe(null);
  });

  it('generates the next sequential registration ID based on existing IDs', () => {
    const existing = [
      'SK27-AIML-0001',
      'SK27-AIML-0002',
      'SK27-AIML-0003',
      'SK27-AIML-0004',
    ];
    const nextId = generateNextRegistrationId('track-web-dev', existing);
    expect(nextId).toBe('SK27-WEB-0005');
  });

  it('handles empty database by starting at 0001', () => {
    const nextId = generateNextRegistrationId('track-ai-ml', []);
    expect(nextId).toBe('SK27-AIML-0001');
  });

  it('handles legacy non-pattern IDs gracefully by using count + 1', () => {
    const legacy = ['uuid-1', 'uuid-2', 'uuid-3'];
    const nextId = generateNextRegistrationId('track-app-dev', legacy);
    expect(nextId).toBe('SK27-APP-0004');
  });
});
