//const __dirname = '/Users/claudiaperez/Desktop/e1_backend-main/'
import multer from 'multer'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Definir el directorio de destino
   cb(null, path.join(__dirname, 'public', 'img'));
  },
  filename: (req, file, cb) => {
    // Definir el nombre del archivo
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

export const uploader = multer({storage});

export default __dirname;