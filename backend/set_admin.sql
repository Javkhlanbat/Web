-- Admin эрх өгөх (99887766 утас эсвэл admin@omnicredit.mn и-мэйл бүхий хэрэглэгчид)
UPDATE users
SET is_admin = true
WHERE phone = '99887766' OR email = 'admin@omnicredit.mn';

-- Админ хэрэглэгчдийг шалгах
SELECT id, email, first_name, last_name, phone, is_admin, created_at
FROM users
WHERE is_admin = true;
