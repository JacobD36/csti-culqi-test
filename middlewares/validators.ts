import { getCardType, isValidCardNumber } from '../helpers/card-validators';
import { IncomingMessage, ServerResponse } from 'http';
import url from 'url';

/**
 * Valida el formato del token recibido en la cabecera de la petición
 * @param { IncomingMessage } req 
 * @param { ServerResponse } res 
 * @param { any } next 
 */
export const validToken = (req: IncomingMessage, res: ServerResponse, next: any) => {
    const token = req.headers['token'] as string;
    const validTokenPattern = /^pk_test_[a-zA-Z0-9]{16}$/;

    if (!token || !validTokenPattern.test(token)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Token no válido' }));
        return;
    }

    next();
}

/**
 * Valida el formato del número de la tarjeta y determina su tipo estableciendolo en la cabecera
 * @param { IncomingMessage } req 
 * @param { ServerResponse } res 
 * @param { any } next 
 */
export const creditCardValidator = (req: IncomingMessage, res: ServerResponse, next: any) => {
    let data: Uint8Array[] = [];

    req.on('data', (resp: any) => {
        data.push(resp);
    });

    req.on('end', () => {
        try {
          let requestData = JSON.parse(Buffer.concat(data).toString());
          const card_number = requestData.card_number;
    
          if (card_number) {
            if(!isValidCardNumber(card_number)){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Número de tarjeta no válido' }));
                return;
            }
          }
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Formato de data inválido' }));
            return;
        }
    });

    next();
}