"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.creditCardValidator = exports.validToken = void 0;
const card_validators_1 = require("../helpers/card-validators");
/**
 * Valida el formato del token recibido en la cabecera de la petición
 * @param { IncomingMessage } req
 * @param { ServerResponse } res
 * @param { any } next
 */
const validToken = (req, res, next) => {
    const token = req.headers['token'];
    const validTokenPattern = /^pk_test_[a-zA-Z0-9]{16}$/;
    if (!token || !validTokenPattern.test(token)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Token no válido' }));
        return;
    }
    next();
};
exports.validToken = validToken;
/**
 * Valida el formato del número de la tarjeta y determina su tipo estableciendolo en la cabecera
 * @param { IncomingMessage } req
 * @param { ServerResponse } res
 * @param { any } next
 */
const creditCardValidator = (req, res, next) => {
    let data = [];
    req.on('data', (resp) => {
        data.push(resp);
    });
    req.on('end', () => {
        try {
            let requestData = JSON.parse(Buffer.concat(data).toString());
            const card_number = requestData.card_number;
            if (card_number) {
                if (!(0, card_validators_1.isValidCardNumber)(card_number)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Número de tarjeta no válido' }));
                    return;
                }
            }
        }
        catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Formato de data inválido' }));
            return;
        }
    });
    next();
};
exports.creditCardValidator = creditCardValidator;
//# sourceMappingURL=validators.js.map