using System.Net;
using System.Net.Mail;

namespace Backend.Services
{
    public class EmailService
    {
        private readonly string _smtpHost;
        private readonly int _smtpPort;
        private readonly string _smtpUser;
        private readonly string _smtpPass;
        private readonly string _fromEmail;

        public EmailService()
        {
            _smtpHost = Environment.GetEnvironmentVariable("SMTP_HOST") ?? "smtp.gmail.com";
            _smtpPort = int.Parse(Environment.GetEnvironmentVariable("SMTP_PORT") ?? "587");
            _smtpUser = Environment.GetEnvironmentVariable("SMTP_USER") ?? "";
            _smtpPass = Environment.GetEnvironmentVariable("SMTP_PASS") ?? "";
            _fromEmail = Environment.GetEnvironmentVariable("FROM_EMAIL") ?? "";
        }

        public async Task SendPasswordResetEmailAsync(string toEmail, string resetToken)
        {
            var frontendBase = Environment.GetEnvironmentVariable("FRONTEND_BASE") ?? "http://localhost:5173";
            var resetLink = $"{frontendBase}/reset?token={resetToken}";

            var subject = "Password Reset Request - MediSync";
            var body = $@"
                <h2>Password Reset Request</h2>
                <p>You requested a password reset for your MediSync account.</p>
                <p>Your reset token is: <strong>{resetToken}</strong></p>
                <p>Or click the link below to reset your password:</p>
                <p><a href='{resetLink}'>Reset Password</a></p>
                <p>This token will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            ";

            await SendEmailAsync(toEmail, subject, body);
        }

        private async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            using var client = new SmtpClient(_smtpHost, _smtpPort)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(_smtpUser, _smtpPass)
            };

            var message = new MailMessage(_fromEmail, toEmail, subject, body)
            {
                IsBodyHtml = true
            };

            await client.SendMailAsync(message);
        }
    }
}