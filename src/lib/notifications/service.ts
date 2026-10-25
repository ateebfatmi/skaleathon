export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  category: 'registration' | 'payment' | 'submission' | 'announcement' | 'results' | 'certificate';
}

export class NotificationService {
  private static outbox: Array<EmailMessage & { timestamp: string; status: 'sent' | 'queued' | 'mocked' }> = [];

  static async sendEmail(message: EmailMessage): Promise<{ success: boolean; provider: string; messageId?: string }> {
    const provider = process.env.EMAIL_PROVIDER || 'console';
    const resendApiKey = process.env.RESEND_API_KEY;

    // Record in local outbox for auditing and verification
    this.outbox.unshift({
      ...message,
      timestamp: new Date().toISOString(),
      status: resendApiKey && !resendApiKey.includes('placeholder') ? 'sent' : 'mocked',
    });

    if (provider === 'resend' && resendApiKey && !resendApiKey.includes('placeholder')) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'Skaleathon <no-reply@skaleathon.in>',
            to: message.to,
            subject: message.subject,
            html: message.html,
          }),
        });
        const data = await res.json();
        return { success: res.ok, provider: 'resend', messageId: data.id };
      } catch (err) {
        console.error('Failed to dispatch email via Resend:', err);
        return { success: false, provider: 'resend' };
      }
    }

    // Safe development console logger
    console.info(`[NOTIFICATION MOCK][${message.category.toUpperCase()}] To: ${message.to} | Subject: "${message.subject}"`);
    return { success: true, provider: 'dev-console', messageId: 'mock_' + Math.random().toString(36).substring(2, 9) };
  }

  static async sendRegistrationConfirmation(params: {
    recipientEmail: string;
    recipientName: string;
    teamName: string;
    orderId: string;
    amountInr: number;
  }) {
    return this.sendEmail({
      to: params.recipientEmail,
      subject: `Registration Confirmed: ${params.teamName} at Skaleathon`,
      category: 'registration',
      html: `
        <div style="font-family: sans-serif; background: #0B0B0B; color: #f1f5f9; padding: 24px; border-radius: 8px;">
          <h2 style="color: #c19a88;">Welcome to Skaleathon!</h2>
          <p>Hi ${params.recipientName},</p>
          <p>Your team <strong>${params.teamName}</strong> has been successfully registered.</p>
          <p>Payment of ₹${params.amountInr} has been authoritatively verified under order <code>${params.orderId}</code>.</p>
          <p>You can access your team dashboard and start preparing your submission anytime.</p>
          <hr style="border: 1px solid #1e293b;" />
          <p style="font-size: 12px; color: #94a3b8;">Presented by SkaleKraft — Build. Innovate. Scale.</p>
        </div>
      `,
    });
  }

  static async sendSubmissionReceipt(params: {
    recipientEmail: string;
    teamName: string;
    projectTitle: string;
    submissionId: string;
  }) {
    return this.sendEmail({
      to: params.recipientEmail,
      subject: `Project Submission Received: ${params.projectTitle} (Skaleathon)`,
      category: 'submission',
      html: `
        <div style="font-family: sans-serif; background: #070a12; color: #f1f5f9; padding: 24px; border-radius: 8px;">
          <h2 style="color: #38bdf8;">Submission Receipt</h2>
          <p>Your project <strong>${params.projectTitle}</strong> submitted by team <strong>${params.teamName}</strong> has been securely logged.</p>
          <p>Submission ID: <code>${params.submissionId}</code></p>
          <p>Our technical evaluation panel will review your submission according to the published criteria.</p>
        </div>
      `,
    });
  }

  static getOutbox() {
    return this.outbox;
  }
}
