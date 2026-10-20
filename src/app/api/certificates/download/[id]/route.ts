import { NextRequest, NextResponse } from 'next/server';
import { EventRepository } from '@/lib/db/repository';
import { generateCertificatePDF } from '@/lib/certificates/generator';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: code } = await params;
    const cert = await EventRepository.getCertificateByCode(code);

    if (!cert) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    if (cert.is_revoked) {
      return NextResponse.json({ error: 'This certificate has been revoked.' }, { status: 410 });
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const siteUrl = `${protocol}://${host}`;

    const pdfBytes = await generateCertificatePDF(cert, siteUrl);

    const safeFilename = `Skaleathon2027_${cert.certificate_code}_${cert.recipient_name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

    return new NextResponse(pdfBytes as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err: any) {
    console.error('PDF generation error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
