const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{8}$/;
  return phoneRegex.test(phone);
};

const validateRegisterNumber = (regNumber) => {
  const regNumberRegex = /^[А-Яа-яӨҮөүA-Za-z]{2}[0-9]{8}$/;
  return regNumberRegex.test(regNumber);
};
const validatePassword = (password) => {
  return password && password.length >= 6;
};
const validateRegistration = (req, res, next) => {
  const { email, password, first_name, last_name, phone, register_number } = req.body;
  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({
      error: 'Дутуу мэдээлэл',
      message: 'И-мэйл, нууц үг, нэр, овог оруулна уу'
    });
  }
  if (email && !validateEmail(email)) {
    return res.status(400).json({
      error: 'И-мэйл буруу',
      message: 'Зөв и-мэйл хаяг оруулна уу'
    });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({
      error: 'Нууц үг богино байна',
      message: 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой'
    });
  }
  if (phone && !validatePhone(phone)) {
    return res.status(400).json({
      error: 'Утасны дугаар буруу',
      message: '8 оронтой утасны дугаар оруулна уу'
    });
  }
  if (register_number && !validateRegisterNumber(register_number)) {
    return res.status(400).json({
      error: 'Регистрийн дугаар буруу',
      message: 'Зөв форматтай регистрийн дугаар оруулна уу (жишээ: АБ12345678)'
    });
  }

  next();
};
const validateLogin = (req, res, next) => {
  const { email, phone, password } = req.body;

  if ((!email && !phone) || !password) {
    return res.status(400).json({
      error: 'Дутуу мэдээлэл',
      message: 'И-мэйл эсвэл утас болон нууц үг оруулна уу'
    });
  }
  if (email && !validateEmail(email)) {
    return res.status(400).json({
      error: 'И-мэйл буруу',
      message: 'Зөв и-мэйл хаяг оруулна уу'
    });
  }
  if (phone && !validatePhone(phone)) {
    return res.status(400).json({
      error: 'Утасны дугаар буруу',
      message: '8 оронтой монгол дугаар оруулна уу'
    });
  }

  next();
};

const validateLoanApplication = (req, res, next) => {
  const { loan_type, amount, duration_months } = req.body;

  if (!loan_type || !amount || !duration_months) {
    return res.status(400).json({
      error: 'Дутуу мэдээлэл',
      message: 'Зээлийн төрөл, дүн, хугацаа оруулна уу'
    });
  }
  if (amount <= 0 || amount > 100000000) {
    return res.status(400).json({
      error: 'Дүн буруу',
      message: 'Зээлийн дүн 0-100,000,000 хооронд байх ёстой'
    });
  }
  if (duration_months < 1 || duration_months > 360) {
    return res.status(400).json({
      error: 'Хугацаа буруу',
      message: 'Зээлийн хугацаа 1-360 сар хооронд байх ёстой'
    });
  }

  next();
};
const validatePayment = (req, res, next) => {
  const { loan_id, amount, payment_method } = req.body;

  if (!loan_id || !amount) {
    return res.status(400).json({
      error: 'Дутуу мэдээлэл',
      message: 'Зээлийн ID болон төлбөрийн дүн оруулна уу'
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      error: 'Дүн буруу',
      message: 'Төлбөрийн дүн 0-ээс их байх ёстой'
    });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateLoanApplication,
  validatePayment
};
