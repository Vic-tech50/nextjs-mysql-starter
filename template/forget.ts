export function forgetTemplate(resetUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
      <body
        style="
          font-family: Arial, sans-serif;
          background:#f5f5f5;
          padding:20px;
        "
      >
        <div
          style="
            max-width:600px;
            margin:auto;
            background:white;
            padding:30px;
            border-radius:8px;
          "
        >
          
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link expires in 30 minutes. If you didn't request this, ignore this email.</p>
    

        </div>
      </body>
    </html>
  `;
}