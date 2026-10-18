import { describe, it, expect } from 'vitest';
import { EventRepository } from '../src/lib/db/repository';
import { generateCertificatePDF } from '../src/lib/certificates/generator';
import { Certificate } from '../src/lib/db/types';

describe('Certificate Generation & Verification Registry', () => {
  it('generates high resolution binary PDF with QR code', async () => {
    const mockCert: Certificate = {
      id: 'cert_unit_test',
      certificate_code: 'SKALE27-R1-TEST99',
      team_id: 'team_test_1',
      team_name: 'Alpha Innovators',
      recipient_name: 'Devika Sharma',
      recipient_email: 'devika@example.com',
      certificate_type: 'winner_first',
      achievement_text: 'First Prize Winner (1st Place) at Skaleathon 2027',
      qr_verification_url: '/verify-certificate/SKALE27-R1-TEST99',
      issued_at: new Date().toISOString(),
      is_revoked: false,
      created_at: new Date().toISOString(),
    };

    const pdfBytes = await generateCertificatePDF(mockCert, 'https://skaleathon.in');
    expect(pdfBytes).toBeDefined();
    expect(pdfBytes.length).toBeGreaterThan(1000); // Verify non-empty valid PDF byte buffer
    // Check PDF magic bytes "%PDF-"
    const header = Buffer.from(pdfBytes.slice(0, 5)).toString('utf-8');
    expect(header).toBe('%PDF-');
  });

  it('retrieves certificate by unique verification code and supports revocation', async () => {
    const testCode = `SKALE27-R2-REVOKE_${Date.now()}`;
    const store = (EventRepository as any).store.getState();

    const cert: Certificate = {
      id: `cert_rev_${Date.now()}`,
      certificate_code: testCode,
      team_id: 'team_revoke_test',
      team_name: 'Revoke Test Team',
      recipient_name: 'Karan Joshi',
      recipient_email: 'karan@example.com',
      certificate_type: 'winner_second',
      achievement_text: 'Second Prize Winner at Skaleathon 2027',
      qr_verification_url: `/verify-certificate/${testCode}`,
      issued_at: new Date().toISOString(),
      is_revoked: false,
      created_at: new Date().toISOString(),
    };
    store.certificates.push(cert);

    // Verify lookup
    const found = await EventRepository.getCertificateByCode(testCode);
    expect(found).toBeDefined();
    expect(found?.recipient_name).toBe('Karan Joshi');
    expect(found?.is_revoked).toBe(false);

    // Revoke
    await EventRepository.revokeCertificate(testCode, 'Plagiarism detected post-event', 'admin_security');

    const updated = await EventRepository.getCertificateByCode(testCode);
    expect(updated?.is_revoked).toBe(true);
    expect(updated?.revocation_reason).toBe('Plagiarism detected post-event');
  });
});
