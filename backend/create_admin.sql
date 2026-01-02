-- Admin хэрэглэгч үүсгэх SQL
-- Утас: 99887766, Нууц үг: admin123

-- Хэрэв 99887766 утастай хэрэглэгч байвал admin эрх өгөх
UPDATE users
SET is_admin = true
WHERE phone = '99887766';

-- Хэрэв 99887766 утастай хэрэглэгч байхгүй бол шинэ admin үүсгэх
INSERT INTO users (email, password, first_name, last_name, phone, is_admin)
SELECT
  'admin@omnicredit.mn',
  '$2b$10$tjV7LlY1MIToMqXxvmnCee.pjCxI2EIBatAzg3rJA5hdL0gy9LF3q', -- admin123
  'Admin',
  'User',
  '99887766',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE phone = '99887766'
);

-- Admin хэрэглэгч үүсгэгдсэн эсэхийг шалгах
SELECT id, email, first_name, last_name, phone, is_admin, created_at
FROM users
WHERE phone = '99887766';
