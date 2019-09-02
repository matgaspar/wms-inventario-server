const fs = require('fs');
const ms = require('ms');
const path = require('path');
const multer = require('multer');
const { PDFImage } = require('pdf-image');
const { to } = require('../services/util.service');
require('dotenv').config();

module.exports = {
  app: process.env.APP || 'production',
  port: process.env.PORT || '7000',
  Sentry: {
    dsn: 'https://34445c8f5a8f42d6811d98fe8d9b0480@sentry.io/1547825',
  },
  DB: {
    timezone: process.env.DB_TIMEZONE || 'Etc/GMT-3' || 'America/Sao_Paulo',
    dialect: process.env.DB_DIALECT || 'mariadb',
    host: process.env.DB_HOST || 'localhost',
    name: process.env.DB_NAME || 'webonl_inventario',
    user: process.env.DB_USER || 'webonl',
    port: process.env.DB_PORT || '3306',
    pass: process.env.DB_PASS || 'gaspar15!',
  },
  JWT: {
    secretOrKey:
      fs.readFileSync(path.resolve('app', 'config', 'keys', 'jwtRS256.key'), 'utf8')
      || process.env.JWT_ENCRYPTION,
    secretPublic:
      fs.readFileSync(path.resolve('app', 'config', 'keys', 'jwtRS256.key.pub'), 'utf8')
      || process.env.JWT_ENCRYPTION,
    Options: {
      algorithm: 'RS256',
      expiresIn: process.env.JWT_EXPIRATION || ms('30d'),
      /* issuer: process.env.JWT_ISSUER || 'Web7Online',
      subject: process.env.JWT_SUBJECT || 'matheus@web7online.com',
      audience: process.env.JWT_AUDIENCE || 'http://web7online.com', */
    },
  },
  Upload: {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.resolve('assets', 'upload', 'tmp'));
      },

      filename: (req, file, cb) => {
        const [, ext] = file.originalname.split('.');
        cb(null, `${file.fieldname}-${Date.now()}.tmp.${ext}`);
      },
    }),
  },
  Pagination: {
    default: {
      page: 1,
      paginate: 25,
    },
  },
  PDF: {
    converter: {
      Image: async (pathfile, cb, options) => {
        const pdfImage = new PDFImage(pathfile, options);
        await to(pdfImage.convertFile().then(imagePath => cb(null, imagePath), err => cb(err)));
      },
    },
  },
};
