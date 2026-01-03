const jwt = require('jsonwebtoken');
const {
  createUser,
  findUserByEmail,
  findUserByPhone,
  findUserById,
  getAllUsers,
  updateUserProfile,
  deleteUser,
  comparePassword
} = require('../models/userModel');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      is_admin: user.is_admin
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone, register_number, id_front, id_back } = req.body;

    if (!email || !password || !first_name || !last_name || !phone) {
      return res.status(400).json({
        error: 'Шаардлагатай талбаруудыг бөглөнө үү',
        message: 'И-мэйл, нууц үг, нэр, утас шаардлагатай'
      });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        error: 'И-мэйл бүртгэлтэй байна',
        message: 'Энэ и-мэйл хаягаар аль хэдийн бүртгүүлсэн байна'
      });
    }

    const existingPhone = await findUserByPhone(phone);
    if (existingPhone) {
      return res.status(400).json({
        error: 'Утас бүртгэлтэй байна',
        message: 'Энэ утасны дугаараар аль хэдийн бүртгүүлсэн байна'
      });
    }

    const newUser = await createUser({
      email,
      password,
      first_name,
      last_name,
      phone,
      register_number,
      id_front,
      id_back,
      is_admin: false
    });

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'Амжилттай бүртгэгдлээ',
      user: {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        phone: newUser.phone,
        is_admin: newUser.is_admin
      },
      token
    });

  } catch (error) {
    console.error('Бүртгэлийн алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        error: 'Утас болон нууц үг шаардлагатай',
        message: 'Бүх талбаруудыг бөглөнө үү'
      });
    }

    const user = await findUserByPhone(phone);
    if (!user) {
      return res.status(401).json({
        error: 'Нэвтрэх нэр эсвэл нууц үг буруу',
        message: 'Хэрэглэгч олдсонгүй'
      });
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Нэвтрэх нэр эсвэл нууц үг буруу',
        message: 'Нууц үг буруу байна'
      });
    }

    const token = generateToken(user);

    res.json({
      message: 'Амжилттай нэвтэрлээ',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        register_number: user.register_number,
        is_admin: user.is_admin
      },
      token
    });

  } catch (error) {
    console.error('Нэвтрэх алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'Хэрэглэгч олдсонгүй',
        message: 'Хэрэглэгчийн мэдээлэл олдсонгүй'
      });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        register_number: user.register_number,
        id_front: user.id_front,
        id_back: user.id_back,
        is_admin: user.is_admin,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('Профайл унших алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, phone, id_front, id_back } = req.body;

    const updatedUser = await updateUserProfile(userId, {
      first_name,
      last_name,
      phone,
      id_front,
      id_back
    });

    res.json({
      message: 'Профайл амжилттай шинэчлэгдлээ',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        phone: updatedUser.phone,
        register_number: updatedUser.register_number,
        id_front: updatedUser.id_front,
        id_back: updatedUser.id_back,
        is_admin: updatedUser.is_admin,
        created_at: updatedUser.created_at
      }
    });

  } catch (error) {
    console.error('Профайл шинэчлэх алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id_front, id_back } = req.body;

    const updatedUser = await updateUserProfile(userId, { id_front, id_back });

    res.json({
      message: 'Зураг амжилттай хадгалагдлаа',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        phone: updatedUser.phone,
        id_front: updatedUser.id_front,
        id_back: updatedUser.id_back,
        is_admin: updatedUser.is_admin
      }
    });

  } catch (error) {
    console.error('Зураг хадгалах алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const verifyToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'Хэрэглэгч олдсонгүй',
        message: 'Токен хүчинтэй боловч хэрэглэгч олдсонгүй'
      });
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        is_admin: user.is_admin
      }
    });

  } catch (error) {
    console.error('Токен шалгах алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const adminGetAllUsers = async (req, res) => {
  try {
    const users = await getAllUsers();

    res.json({
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        register_number: user.register_number,
        is_admin: user.is_admin,
        created_at: user.created_at
      }))
    });

  } catch (error) {
    console.error('Хэрэглэгчдийг унших алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const adminGetUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'Хэрэглэгч олдсонгүй',
        message: 'Хэрэглэгчийн мэдээлэл олдсонгүй'
      });
    }

    res.json({ user });

  } catch (error) {
    console.error('Хэрэглэгчийн дэлгэрэнгүй унших алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const adminDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user ID
    const parsedId = parseInt(userId);
    if (isNaN(parsedId) || parsedId <= 0) {
      return res.status(400).json({
        error: 'Буруу хэрэглэгчийн ID',
        message: 'Хэрэглэгчийн ID бүхэл тоо байх ёстой'
      });
    }

    const deletedUser = await deleteUser(parsedId);

    if (!deletedUser) {
      return res.status(404).json({
        error: 'Хэрэглэгч олдсонгүй',
        message: 'Устгах хэрэглэгч олдсонгүй'
      });
    }

    res.json({
      message: 'Хэрэглэгч амжилттай устгагдлаа',
      userId: deletedUser.id
    });

  } catch (error) {
    console.error('Хэрэглэгч устгах алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const createAdminUser = async (req, res) => {
  try {
    const { email = 'admin@omnicredit.mn', password = 'admin123', phone = '99887766' } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        error: 'И-мэйл бүртгэлтэй байна',
        message: 'Энэ и-мэйл хаягаар аль хэдийн бүртгүүлсэн байна'
      });
    }

    const newUser = await createUser({
      email,
      password,
      first_name: 'Admin',
      last_name: 'User',
      phone,
      register_number: null,
      id_front: null,
      id_back: null,
      is_admin: true
    });

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'Админ амжилттай үүсгэгдлээ',
      user: {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        phone: newUser.phone,
        is_admin: newUser.is_admin
      },
      token
    });

  } catch (error) {
    console.error('Create admin алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  uploadProfileImage,
  verifyToken,
  adminGetAllUsers,
  adminGetUserDetails,
  adminDeleteUser,
  createAdminUser
};
