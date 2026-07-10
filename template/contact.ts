export function contactTemplate(name: string,email: string,message: string) {
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
          <h2>New Contact Message</h2>

          <hr>

          <p>
            <strong>Name:</strong> ${name}
          </p>

          <p>
            <strong>Email:</strong> ${email}
          </p>

          <p>
            <strong>Message:</strong>
          </p>

          <p>${message}</p>

        </div>
      </body>
    </html>
  `;
}