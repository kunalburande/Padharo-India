import pool from '../../config/db.js';

class OtpModel {
  static async ensureTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS otps (
        mobile VARCHAR(20) PRIMARY KEY,
        otp_code VARCHAR(10) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await pool.execute(sql);
  }

  static async storeOtp(mobile, otp, expiresAt) {
    await this.ensureTable();
    const sql = `
      INSERT INTO otps (mobile, otp_code, expires_at)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE otp_code = VALUES(otp_code), expires_at = VALUES(expires_at), created_at = CURRENT_TIMESTAMP
    `;
    const [result] = await pool.execute(sql, [mobile, otp, expiresAt]);
    return result.affectedRows > 0;
  }

  static async verifyOtp(mobile, otp) {
    await this.ensureTable();
    const sql = `
      SELECT mobile FROM otps
      WHERE mobile = ? AND otp_code = ? AND expires_at >= NOW()
      LIMIT 1
    `;
    const [rows] = await pool.execute(sql, [mobile, otp]);
    return rows.length > 0;
  }

  static async deleteOtp(mobile) {
    const sql = 'DELETE FROM otps WHERE mobile = ?';
    const [result] = await pool.execute(sql, [mobile]);
    return result.affectedRows > 0;
  }
}

export default OtpModel;
