import jwt from 'jsonwebtoken';

// Соль для токена
const privateKey = 'cdtlkznjujxnj,sns,scnhttghbt[fkf';

export default function decodeToken(token) {
    return new Promise((resolve, reject) => {
       jwt.verify(token, process.env.SALT, (error, decoded) => {
          if (error) {
             reject(error);
          } else {
             resolve(decoded);
          }
       });
    });
 }