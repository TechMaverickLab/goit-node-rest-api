const User = require('../schemas/userModel');
const { createError } = require('../helpers/HttpError');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(409, 'Email in use');
    }

    const newUser = new User({ email });
    newUser.setPassword(password);
    await newUser.save();

    const payload = { id: newUser._id, token: newUser.token };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    newUser.token = token;
    await newUser.save();

    res.status(201).json({
      token,
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.validPassword(password)) {
      throw createError(401, 'Email or password is wrong');
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
    const { email, subscription } = req.user;
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
        message: 'Not authorized',
      });
    }
    user.token = null;
    await user.save();
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
      throw createError(404, 'User not found');
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

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
};
