import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, path.join(__dirname, '..','..', '/public/user_images'))
    },filename: (req, files,cb) => {
        cb(null, files.originalname+'_'+uuidv4()+'_'+'.png');
    }
});

const upload = multer({ storage: storage });

export default upload;