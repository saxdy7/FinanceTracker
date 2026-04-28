// Email Service using Nodemailer
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendBudgetAlert(userEmail, budgetData) {
    const { category, spent, limit, percentage } = budgetData;
    const htmlContent = `
      <h2>Budget Alert! 🚨</h2>
      <p>Hi there,</p>
      <p>You've reached <strong>${percentage}%</strong> of your <strong>${category}</strong> budget.</p>
      <p>
        <strong>Spent:</strong> $${spent.toFixed(2)}<br>
        <strong>Budget Limit:</strong> $${limit.toFixed(2)}<br>
        <strong>Remaining:</strong> $${(limit - spent).toFixed(2)}
      </p>
      <p>Consider reviewing your spending in this category.</p>
      <p>Best regards,<br>FinanceTracker Team</p>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `Budget Alert: ${category} Category`,
        html: htmlContent
      });
      return { success: true, message: 'Alert email sent' };
    } catch (error) {
      console.error('Email Error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWeeklySummary(userEmail, summaryData) {
    const { totalSpent, budgetStatus, savings, period } = summaryData;
    const htmlContent = `
      <h2>Weekly Financial Summary 📊</h2>
      <p>Hi there,</p>
      <p>Here's your spending summary for ${period}:</p>
      <p><strong>Total Spent:</strong> $${totalSpent.toFixed(2)}</p>
      <p><strong>Savings:</strong> $${savings.toFixed(2)}</p>
      <h3>Budget Status by Category:</h3>
      <ul>
        ${budgetStatus.map(b => `
          <li>
            <strong>${b.category}:</strong> $${b.spent.toFixed(2)} / $${b.limit.toFixed(2)}
            (${((b.spent / b.limit) * 100).toFixed(1)}%)
          </li>
        `).join('')}
      </ul>
      <p>Keep up the great work with your finances!</p>
      <p>Best regards,<br>FinanceTracker Team</p>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Weekly Financial Summary',
        html: htmlContent
      });
      return { success: true, message: 'Summary email sent' };
    } catch (error) {
      console.error('Email Error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendVerificationEmail(userEmail, token) {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const htmlContent = `
      <h2>Verify Your Email Address</h2>
      <p>Welcome to FinanceTracker!</p>
      <p>Click the link below to verify your email address:</p>
      <p><a href="${verificationLink}">Verify Email</a></p>
      <p>Or copy this link: ${verificationLink}</p>
      <p>This link will expire in 24 hours.</p>
      <p>Best regards,<br>FinanceTracker Team</p>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Verify Your FinanceTracker Email',
        html: htmlContent
      });
      return { success: true, message: 'Verification email sent' };
    } catch (error) {
      console.error('Email Error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendPasswordReset(userEmail, token) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const htmlContent = `
      <h2>Password Reset Request</h2>
      <p>Hi there,</p>
      <p>You requested a password reset. Click the link below to proceed:</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>Or copy this link: ${resetLink}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>FinanceTracker Team</p>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Reset Your FinanceTracker Password',
        html: htmlContent
      });
      return { success: true, message: 'Reset email sent' };
    } catch (error) {
      console.error('Email Error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendMonthlyReport(userEmail, reportData) {
    const { month, totalIncome, totalExpenses, categoryBreakdown, savings } = reportData;
    const htmlContent = `
      <h2>Monthly Financial Report 📈</h2>
      <p>Hi there,</p>
      <p>Here's your financial report for ${month}:</p>
      <p><strong>Total Income:</strong> $${totalIncome.toFixed(2)}</p>
      <p><strong>Total Expenses:</strong> $${totalExpenses.toFixed(2)}</p>
      <p><strong>Net Savings:</strong> $${savings.toFixed(2)}</p>
      <h3>Spending by Category:</h3>
      <ul>
        ${Object.entries(categoryBreakdown).map(([cat, amount]) => `
          <li><strong>${cat}:</strong> $${amount.toFixed(2)}</li>
        `).join('')}
      </ul>
      <p>Keep managing your finances wisely!</p>
      <p>Best regards,<br>FinanceTracker Team</p>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `Monthly Financial Report - ${month}`,
        html: htmlContent
      });
      return { success: true, message: 'Report email sent' };
    } catch (error) {
      console.error('Email Error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendContactFormSubmission(contactData) {
    const { name, email, subject, message } = contactData;
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

    const htmlContent = `
      <h2>New Contact Form Submission 📨</h2>
      <p><strong>From:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <h3>Message:</h3>
      <p>${message}</p>
      <hr>
      <p><small>This message was sent from FinanceTracker contact form</small></p>
    `;

    // Send to admin
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: `New Contact Form: ${subject}`,
        html: htmlContent,
        replyTo: email
      });
    } catch (error) {
      console.error('Error sending admin email:', error);
      throw error;
    }

    // Send confirmation to user
    const confirmationHtml = `
      <h2>Thank You for Contacting FinanceTracker! 🙏</h2>
      <p>Hi ${name},</p>
      <p>We received your message and will get back to you as soon as possible.</p>
      <h3>Your Message:</h3>
      <p><strong>Subject:</strong> ${subject}</p>
      <p>${message}</p>
      <p>Best regards,<br>FinanceTracker Team</p>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'We received your message - FinanceTracker',
        html: confirmationHtml
      });
      return { success: true, message: 'Contact form received' };
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
