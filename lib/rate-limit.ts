import db from "@/lib/db";

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

export async function checkLoginRateLimit(
  email: string,
  ip: string
) {
  const [rows]: any = await db.query(
    `
    SELECT COUNT(*) AS attempts
    FROM login_attempts
    WHERE
      (
        email = ?
        OR ip_address = ? 
      )
      AND created_at >= NOW() - INTERVAL ? MINUTE
    `,
    [email, ip, WINDOW_MINUTES]
  );

  return {
    blocked: rows[0].attempts >= MAX_ATTEMPTS,
    attempts: rows[0].attempts,
    remaining: Math.max(0, MAX_ATTEMPTS - rows[0].attempts),
  };
}

export async function recordLoginAttempt(
  email: string,
  ip: string
) {
  await db.query(
    `
    INSERT INTO login_attempts(email, ip_address)
    VALUES(?, ?)
    `,
    [email, ip]
  );
}

export async function clearLoginAttempts(
  email: string,
  ip: string
) {
  await db.query(
    `
    DELETE FROM login_attempts
    WHERE email = ?
       OR ip_address = ?
    `,
    [email, ip]
  );
}

//this is the SQL to create the login_attempts table in your MySQL database:
// CREATE TABLE login_attempts (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     email VARCHAR(255),
//     ip_address VARCHAR(45),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

//     INDEX(email),
//     INDEX(ip_address),
//     INDEX(created_at)
// );