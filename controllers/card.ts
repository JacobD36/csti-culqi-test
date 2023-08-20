import url from 'url';
import { generateRandomString } from "../helpers/card_utils";
import { Card } from "../models/card";
import { cvvValidator, isExpire, isValidCardNumber, validateEmailFormat, validateNumbersOnly } from '../helpers/card-validators';

/**
 * reación de token para la tarjeta
 * @param { any } req 
 * @param { any } res 
 */
export const postCard = async(req: any, res: any) => {
    let body = '';
    const tokenID = generateRandomString(16);

    req.on('data', (resp: any) => {
        body += resp.toString();
    });

    req.on('end', () => {
        try {
          const cardData = JSON.parse(body);
          cardData.token = tokenID;

          if (!cardData.token || !cardData.email || !cardData.card_number || !cardData.cvv || !cardData.expiration_year || !cardData.expiration_month) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Se requiere la información completa - Correo, número de tarjeta, CVV y año y mes de expiración' }));
            return;
          } else {
            if(cardData.card_number.length < 15 || cardData.card_number.length > 16) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'La tarjeta debe tener un mínimo de 13 dígitos y un máximo de 16' }));
                return;
            }

            if(cardData.email.length < 5 || cardData.email.length > 100) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'El correo debe tener un mínimo de 5 caracteres y un máximo de 100' }));
                return;
            }

            if(!validateEmailFormat(cardData.email)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'El correo no tiene un formato válido' }));
                return;
            }

            if(isExpire(cardData.expiration_year) != true) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'El año de expiración de la tarjeta no puede ser mayor que el año en curso por más de 5 años o, en su defecto, no puede ser menor que el año en curso' }));
                return;
            }

            if(!validateNumbersOnly(cardData.card_number)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'El número de tarjeta sólo puede contener números' }));
                return;
            }

            if(!isValidCardNumber(cardData.card_number)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'El número de tarjeta no es válido' }));
                return;
            }

            if(cardData.cvv.length < 3 || cardData.cvv.length > 4) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'El CVV debe tener un mínimo de 3 dígitos y un máximo de 4' }));
                return;
            }

            if(!validateNumbersOnly(cardData.cvv)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'El CVV sólo puede contener números' }));
                return;
            }

            if(!cvvValidator(cardData.card_number, cardData.cvv)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'El CVV no es válido' }));
                return;
            }

            if(cardData.expiration_month < 1 || cardData.expiration_month > 12) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'El mes de expiración de la tarjeta debe estar entre 1 y 12' }));
                return;
            }

            Card.create(cardData);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ token: tokenID }));
            return;
          }
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: error }));
          return;
        }
    });
}

export const getCard = async(req: any, res: any) => {
    const parsedUrl = url.parse(req.url!, true);
    const token = parsedUrl.pathname?.split('/').pop();

    if (token) {
        Card.getCardByToken(token, (error, cardData) => {
            if(error) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'No existe la tarjeta' }));
                return;
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(cardData));
                return;
            }
        });
    } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Token no válido' }));
        return;
    }
}