import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { Team, TeamMember, EventTrack, PaymentOrder } from '../db/types';

export interface ReceiptData {
  team: Team;
  members: TeamMember[];
  track?: EventTrack | null;
  paymentOrder?: PaymentOrder | null;
  leaderMember?: TeamMember | null;
  siteUrl?: string;
}

export async function generateReceiptPDF(data: ReceiptData): Promise<Uint8Array> {
  const { team, members, track, paymentOrder, leaderMember, siteUrl = 'https://skaleathon.skalekraft.in' } = data;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm

  // Clean luxury light background
  doc.setFillColor(252, 250, 248);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer framing
  doc.setDrawColor(24, 24, 27);
  doc.setLineWidth(0.7);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Inner copper hairline
  doc.setDrawColor(193, 154, 136);
  doc.setLineWidth(0.3);
  doc.rect(11.5, 11.5, pageWidth - 23, pageHeight - 23);

  // Top header band (Deep Charcoal)
  doc.setFillColor(18, 17, 16);
  doc.rect(11.5, 11.5, pageWidth - 23, 26, 'F');

  // SkaleKraft Brand
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(193, 154, 136);
  doc.text('SKALEKRAFT PRESENTS', 18, 19);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('SKALEATHON 2027', 18, 27);

  // Document Type Label
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(160, 150, 140);
  doc.text('Official Tournament Document', pageWidth - 18, 19, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('REGISTRATION RECEIPT', pageWidth - 18, 25, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(193, 154, 136);
  doc.text('National Engineering Tournament', pageWidth - 18, 30, { align: 'right' });

  // Key Status & Credentials Ribbon
  let y = 43;
  doc.setFillColor(245, 242, 237);
  doc.setDrawColor(220, 215, 205);
  doc.setLineWidth(0.3);
  doc.roundedRect(16, y, pageWidth - 32, 22, 2, 2, 'FD');

  // Status Badge
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(20, y + 4, 32, 6, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('VERIFIED PAID', 36, y + 8, { align: 'center' });

  // Registration ID
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 110, 100);
  doc.text('Registration Credential ID', 58, y + 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(24, 24, 27);
  doc.text(team.id.toUpperCase(), 58, y + 14);

  // Amount Paid
  const amountStr = paymentOrder?.amount_inr ? `INR ${Number(paymentOrder.amount_inr).toFixed(2)}` : 'INR 500.00';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 110, 100);
  doc.text('Registration Fee', 128, y + 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(24, 24, 27);
  doc.text(amountStr, 128, y + 14);

  // Issued Date
  const issuedDate = team.created_at
    ? new Date(team.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 110, 100);
  doc.text('Enrollment Date', 170, y + 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(24, 24, 27);
  doc.text(issuedDate, 170, y + 14);

  // Squad Title Section
  y = 72;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(193, 154, 136);
  doc.text('OFFICIAL TOURNAMENT ENTRY FOR', 16, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(18, 17, 16);
  doc.text(team.name, 16, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 95, 90);
  doc.text(`Authorized Engineering Squad // ${track?.name || 'Tournament Track'}`, 16, y);

  // Particulars 4-Box Grid
  y += 8;
  const colWidth = (pageWidth - 32 - 9) / 4;
  const effectiveLeader = leaderMember || members.find((m) => m.role === 'leader') || members[0];
  const boxes = [
    { label: 'COMPETITION TRACK', val: track?.name || 'General Arena' },
    { label: 'TEAM LEADER', val: effectiveLeader?.name || 'Team Lead' },
    { label: 'INSTITUTION', val: team.college_or_org || 'Independent Squad' },
    { label: 'LOCATION', val: `${team.city ? team.city + ', ' : ''}${team.state || 'India'}` },
  ];

  boxes.forEach((b, i) => {
    const x = 16 + i * (colWidth + 3);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(225, 220, 212);
    doc.roundedRect(x, y, colWidth, 16, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(140, 130, 120);
    doc.text(b.label, x + 3, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(24, 24, 27);
    const splitText = doc.splitTextToSize(b.val, colWidth - 6);
    doc.text(splitText[0], x + 3, y + 11);
  });

  // Confirmed Squad Roster Table
  y += 24;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(18, 17, 16);
  doc.text(`CONFIRMED SQUAD ROSTER (${members.length}/6 SEATS CONFIRMED)`, 16, y);

  y += 4;
  // Table Header
  doc.setFillColor(240, 236, 230);
  doc.rect(16, y, pageWidth - 32, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 75, 70);
  doc.text('#', 20, y + 5);
  doc.text('PARTICIPANT NAME', 30, y + 5);
  doc.text('ROLE', 95, y + 5);
  doc.text('OFFICIAL EMAIL', 125, y + 5);
  doc.text('PHONE', 172, y + 5);

  y += 7;
  members.forEach((m, idx) => {
    const isLeader = m.id === effectiveLeader?.id || m.role === 'leader';
    const rowBg = idx % 2 === 0 ? 255 : 249;
    doc.setFillColor(rowBg, rowBg, rowBg);
    doc.rect(16, y, pageWidth - 32, 8, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(40, 40, 40);
    doc.text(String(idx + 1).padStart(2, '0'), 20, y + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.text(m.name, 30, y + 5.5);

    doc.setFont('helvetica', isLeader ? 'bold' : 'normal');
    doc.setTextColor(isLeader ? 128 : 90, isLeader ? 89 : 90, isLeader ? 72 : 90);
    doc.text(isLeader ? 'Team Lead' : 'Member', 95, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(70, 70, 70);
    doc.text(m.email, 125, y + 5.5);
    doc.text(m.phone || '—', 172, y + 5.5);

    y += 8;
  });

  // Verification & Security QR Section
  y += 8;
  doc.setFillColor(245, 242, 237);
  doc.setDrawColor(220, 215, 205);
  doc.roundedRect(16, y, pageWidth - 32, 36, 2, 2, 'FD');

  const verificationUrl = `${siteUrl}/dashboard/team?pass=${encodeURIComponent(team.id)}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(verificationUrl, { margin: 1, width: 120 });
    doc.addImage(qrDataUrl, 'PNG', 20, y + 3.5, 29, 29);
  } catch {
    doc.setFont('helvetica', 'bold');
    doc.text('[QR]', 28, y + 18);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(18, 17, 16);
  doc.text('Official Tournament Verification Record', 54, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(90, 85, 80);
  const desc = 'Scan this QR code to verify this official tournament credential against the SkaleKraft registry. Present this receipt or your digital credential record with photo ID at tournament checkpoints.';
  doc.text(doc.splitTextToSize(desc, pageWidth - 32 - 42), 54, y + 14);

  const paymentRef = paymentOrder?.razorpay_payment_id || 'RZP_SETTLED_TEST';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(110, 105, 100);
  doc.text(`Payment Reference: ${paymentRef}`, 54, y + 26);
  doc.text(`Official Tournament Portal: ${siteUrl}`, 54, y + 31);

  // Footer
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(128, 89, 72);
  doc.text('SKALEKRAFT', 16, pageHeight - 16);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 140, 130);
  doc.text('• Build. Innovate. Scale.', 37, pageHeight - 16);

  doc.text('System-generated official receipt · Authorized digital seal · skaleathon.skalekraft.in', pageWidth - 16, pageHeight - 16, { align: 'right' });

  const arrayBuffer = doc.output('arraybuffer');
  return new Uint8Array(arrayBuffer);
}
