/**
 * Registration ID Pattern Generator for Skaleathon 2027
 * Pattern format: SK27-[TRACK]-[XXXX]
 * e.g., SK27-AIML-0001, SK27-WEB-0002, SK27-APP-0003
 */

export const TRACK_CODE_MAP: Record<string, string> = {
  'track-ai-ml': 'AIML',
  'track-web-dev': 'WEB',
  'track-app-dev': 'APP',
};

/**
 * Resolves a compact uppercase track code for registration IDs.
 */
export function getTrackCode(trackId?: string | null): string {
  if (!trackId) return 'GEN';
  const normalized = trackId.toLowerCase().trim();
  if (TRACK_CODE_MAP[normalized]) {
    return TRACK_CODE_MAP[normalized];
  }
  if (normalized.includes('ai') || normalized.includes('ml')) return 'AIML';
  if (normalized.includes('web')) return 'WEB';
  if (normalized.includes('app') || normalized.includes('mobile')) return 'APP';
  return 'GEN';
}

/**
 * Parses sequence number from any registration ID matching:
 * - SK27-[TRACK]-[0-9]+
 * - SK27-[0-9]+
 */
export function parseRegistrationSequence(id: string): number | null {
  if (!id || typeof id !== 'string') return null;
  const match = id.match(/^SK27-(?:[A-Z0-9]+-)?(\d+)$/i);
  if (match && match[1]) {
    const val = parseInt(match[1], 10);
    return isNaN(val) ? null : val;
  }
  return null;
}

/**
 * Formats a clean registration ID from track and sequence number.
 * e.g. formatRegistrationId('track-ai-ml', 1) => "SK27-AIML-0001"
 */
export function formatRegistrationId(trackId: string | null | undefined, sequence: number): string {
  const code = getTrackCode(trackId);
  const padded = String(Math.max(1, sequence)).padStart(4, '0');
  return `SK27-${code}-${padded}`;
}

/**
 * Calculates next sequential registration ID based on existing IDs in database.
 */
export function generateNextRegistrationId(
  trackId: string | null | undefined,
  existingTeamIds: string[]
): string {
  let maxSeq = 0;
  for (const id of existingTeamIds) {
    const seq = parseRegistrationSequence(id);
    if (seq !== null && seq > maxSeq) {
      maxSeq = seq;
    }
  }

  // If there were patterned IDs found, increment from max; otherwise count + 1
  const nextSeq = maxSeq > 0 ? maxSeq + 1 : Math.max(existingTeamIds.length + 1, 1);
  return formatRegistrationId(trackId, nextSeq);
}
