const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    await User.create({ username, email, password });
    res.status(201).json({ message: req.t('auth:register.success') });
  } catch (error) {
    res.status(400).json({ error: req.t('auth:register.fail') });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !(await user.isValidPassword(password))) {
      return res.status(401).json({ error: req.t('auth:login.fail') });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, message: req.t('auth:login.success') });
  } catch (error) {
    res.status(500).json({ error: req.t('error.general') });
  }
};

// If you have a logout function, you can add it here
exports.logout = (req, res) => {
  // Implement logout logic if needed
  res.json({ message: req.t('auth:logout.success') });
};

// Function to get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email']
    });
    if (!user) {
      return res.status(404).json({ error: req.t('auth:profile.notFound') });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: req.t('error.general') });
  }
};

// Function to update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: req.t('auth:profile.notFound') });
    }
    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();
    res.json({ message: req.t('auth:profile.updateSuccess') });
  } catch (error) {
    res.status(400).json({ error: req.t('auth:profile.updateFail') });
  }
};