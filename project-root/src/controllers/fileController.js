const { File } = require('../models');
const path = require('path');
const fs = require('fs').promises;

exports.createDirectory = async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const userId = req.user.id;  // Assuming you have authentication middleware

    const directory = await File.create({
      name,
      path: name,  // For simplicity, just using name as path
      size: 0,
      type: 'directory',
      isDirectory: true,
      parentId,
      userId,
    });

    res.status(201).json(directory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    const { originalname, mimetype, size, buffer } = req.file;
    const { parentId } = req.body;
    const userId = req.user.id;

    // Save file to disk
    const filePath = path.join(__dirname, '..', '..', 'uploads', originalname);
    await fs.writeFile(filePath, buffer);

    const file = await File.create({
      name: originalname,
      path: filePath,
      size,
      type: mimetype,
      isDirectory: false,
      parentId,
      userId,
    });

    res.status(201).json(file);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const userId = req.user.id;
    const { parentId } = req.query;

    const files = await File.findAll({
      where: { userId, parentId: parentId || null },
    });

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.id;

    const file = await File.findOne({ where: { id, userId } });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    file.name = name;
    await file.save();

    res.json(file);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const file = await File.findOne({ where: { id, userId } });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (!file.isDirectory) {
      await fs.unlink(file.path);
    }

    await file.destroy();

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};