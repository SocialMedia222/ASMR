import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: '../uploads',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = function (req, file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Only .jpeg, .jpg and .png files are allowed!');
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});