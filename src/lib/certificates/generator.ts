import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { Certificate } from '../db/types';

export async function generateCertificatePDF(cert: Certificate, siteUrl: string = 'https://skaleathon.skalekraft.in'): Promise<Uint8Array> {
  // Create landscape A4 document
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(11, 11, 11);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer Decorative Borders (SkaleKraft Copper & Champagne)
  doc.setDrawColor(193, 154, 136); // #f5f5f5 copper
  doc.setLineWidth(1.2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  doc.setDrawColor(128, 89, 72); // #737373 warm bronze
  doc.setLineWidth(0.4);
  doc.rect(13, 13, pageWidth - 26, pageHeight - 26);

  // Corner Accent Diamonds
  const drawCornerDiamond = (x: number, y: number) => {
    doc.setFillColor(193, 154, 136);
    doc.lines([[3, 3], [-3, 3], [-3, -3], [3, -3]], x, y - 3, [1, 1], 'FD');
  };
  drawCornerDiamond(10, 10);
  drawCornerDiamond(pageWidth - 10, 10);
  drawCornerDiamond(10, pageHeight - 10);
  drawCornerDiamond(pageWidth - 10, pageHeight - 10);

  // Organizer Badge
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(193, 154, 136);
  doc.text('SKALEKRAFT PRESENTS', pageWidth / 2, 26, { align: 'center' });

  // Main Event Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text('SKALEATHON', pageWidth / 2, 36, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(232, 197, 180); // #ffffff champagne
  doc.text('BUILD. INNOVATE. SCALE. — A NATIONAL ONLINE HACKATHON', pageWidth / 2, 43, { align: 'center' });

  // Certificate Heading
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(243, 244, 246);
  doc.text('CERTIFICATE OF ACHIEVEMENT', pageWidth / 2, 60, { align: 'center' });

  // Body Text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(156, 163, 175);
  doc.text('This is proudly presented to', pageWidth / 2, 70, { align: 'center' });

  // Participant Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(232, 197, 180); // #ffffff champagne
  doc.text(cert.recipient_name.toUpperCase(), pageWidth / 2, 83, { align: 'center' });

  // Team & Achievement
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(229, 231, 235);
  const teamText = cert.team_name ? `representing Team "${cert.team_name}"` : '';
  doc.text(
    `for outstanding innovation, technical excellence, and meritorious performance ${teamText}`,
    pageWidth / 2,
    95,
    { align: 'center' }
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(193, 154, 136);
  doc.text(cert.achievement_text, pageWidth / 2, 105, { align: 'center' });

  // Verification QR Code
  const verifyUrl = `${siteUrl}${cert.qr_verification_url}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
      width: 120,
    });
    doc.addImage(qrDataUrl, 'PNG', pageWidth / 2 - 15, 120, 30, 30);
  } catch (err) {
    console.error('QR code generation error:', err);
  }

  // QR Label & Certificate Code
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Verify Online: ${cert.certificate_code}`, pageWidth / 2, 155, { align: 'center' });

  // Signatures & Issuer Info
  const leftX = 40;
  const rightX = pageWidth - 40;
  const sigY = pageHeight - 35;

  // Left Signer: SkaleKraft Leadership
  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.5);
  doc.line(leftX - 25, sigY, leftX + 25, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('SkaleKraft Advisory Board', leftX, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Event Chair & Organizer', leftX, sigY + 10, { align: 'center' });

  // Right Signer: Date & Issue Authority
  doc.line(rightX - 25, sigY, rightX + 25, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(new Date(cert.issued_at).toLocaleDateString('en-IN', { dateStyle: 'long' }), rightX, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Date of Conferral', rightX, sigY + 10, { align: 'center' });

  return new Uint8Array(doc.output('arraybuffer'));
}
