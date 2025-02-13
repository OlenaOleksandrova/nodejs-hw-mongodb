import multer from 'multer';
import path from 'node:path';
import { TEMP_DIR_PATH } from '../constants/path.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_DIR_PATH);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();

    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

export const upload = multer({ storage });
