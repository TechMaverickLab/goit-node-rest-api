const User = require('../schemas/userModel');
const { createError } = require('../helpers/HttpError');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
const gravatar = require('gravatar');
const path = require('path');
const jimp = require('jimp');
const fs = require('fs').promises;
const sendEmail = require('../helpers/sendEmail');

const register = async (req, res, next) => {
  console.log('Функція реєстрації викликана');
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Користувач вже існує');
      throw createError(409, 'Email вжe використовується');
    }
    console.log('Користувач не існує, продовжуємо реєстрацію');

    const avatarURL = gravatar.url(email);
    console.log('Gravatar URL:', avatarURL);

    const { nanoid } = await import('nanoid');
    const verificationToken = nanoid();
    console.log('Згенеровано токен підтвердження:', verificationToken);

    const newUser = new User({ email, password, avatarURL, verificationToken });
    console.log('Новий користувач з токеном підтвердження:', newUser.verificationToken);

    newUser.setPassword(password);

    console.log('Користувач перед збереженням:', newUser.verificationToken);

    await newUser.save();
    console.log('Користувач збережений з токеном підтвердження:', newUser.verificationToken);

    const mail = {
      to: email,
      subject: 'Підтвердження електронної пошти',
      html: `<a href="http://localhost:3000/api/users/verify/${verificationToken}">Підтвердіть вашу електронну пошту</a>`,
      from: 'techmavericklab@gmail.com'
    };

    console.log('Вміст електронної пошти:', mail);

    try {
      await sendEmail(mail);
      console.log('Електронна пошта успішно надіслана');
    } catch (emailError) {
      console.error('Помилка відправки електронної пошти:', emailError);
      await User.findByIdAndDelete(newUser._id);
      throw createError(500, 'Помилка відправки підтверджувального електронного листа');
    }

    res.status(201).json({
      message: 'Registration successful, please check your email to verify your account.',
    });
  } catch (error) {
    console.error('Помилка під час реєстрації:', error);
    next(error);
  }
};


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });

    if (!user || !user.validPassword(password)) {
      throw createError(401, 'Email або пароль невірний');
    }

    if (!user.verify) {
      throw createError(401, 'Електронна пошта не підтверджена');
    }

    const payload = { id: user._id, token: user.token };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    user.token = token;
    await user.save();

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};


const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription, token } = req.user;
    res.json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Не авторизовано',
      });
    }
    user.token = null;
    await user.save();
    console.log('Користувач вийшов з системи, токен анульовано');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const { subscription } = req.body;
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { subscription },
      { new: true }
    );

    if (!user) {
      throw createError(404, 'Користувач не знайдений');
    }

    res.json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { id: userId, token } = req.user;
    const { path: tmpPath, filename } = req.file;
    const avatarsDir = path.join(__dirname, '..', 'public', 'avatars');
    const newPath = path.join(avatarsDir, filename);

    const image = await jimp.read(tmpPath);
    await image.resize(250, 250).writeAsync(tmpPath);

    await fs.rename(tmpPath, newPath);

    const avatarURL = `/avatars/${filename}`;
    await User.findByIdAndUpdate(userId, { avatarURL }, { new: true });

    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw createError(404, 'Користувач не знайдений');
    }

    user.verify = true;
    user.verificationToken = null;

    await user.save();

    res.json({
      message: 'Підтвердження успішне',
    });
  } catch (error) {
    console.error('Помилка під час перевірки електронної пошти:', error);
    next(error);
  }
};


const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw createError(404, 'Користувач не знайдений');
    }

    if (user.verify) {
      res.status(400).json({
        message: 'Підтвердження вже пройдено',
      });
      return;
    }

    if (!user.verificationToken) {
      const { nanoid } = await import('nanoid');
      user.verificationToken = nanoid();
      await user.save();
    }
    
    const mail = {
      to: email,
      subject: 'Підтвердження електронної пошти',
      html: `<a href="http://localhost:3000/api/users/verify/${user.verificationToken}">Підтвердіть вашу електронну пошту</a>`,
    };

    await sendEmail(mail);


    res.json({
      message: 'Підтверджувальний лист надіслано',
    });
  } catch (error) {
    next(error);
  }
};



module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
  verifyEmail,
  resendVerificationEmail,

};
