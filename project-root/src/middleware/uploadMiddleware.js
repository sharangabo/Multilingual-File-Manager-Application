const multer = require('multer');

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx)$/)) {
      return cb(new Error('Only image, PDF, and Office files are allowed!'), false);
    }
    cb(null, true);
  }
});

module.exports = upload;