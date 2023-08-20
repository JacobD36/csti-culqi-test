"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCard = exports.postCard = void 0;
const url_1 = __importDefault(require("url"));
const card_utils_1 = require("../helpers/card_utils");
const card_1 = require("../models/card");
const card_validators_1 = require("../helpers/card-validators");
/**
 * reación de token para la tarjeta
 * @param { any } req
 * @param { any } res
 */
const postCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = '';
    const tokenID = (0, card_utils_1.generateRandomString)(16);
    req.on('data', (resp) => {
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
            }
            else {
                if (cardData.card_number.length < 15 || cardData.card_number.length > 16) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'La tarjeta debe tener un mínimo de 13 dígitos y un máximo de 16' }));
                    return;
                }
                if (cardData.email.length < 5 || cardData.email.length > 100) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'El correo debe tener un mínimo de 5 caracteres y un máximo de 100' }));
                    return;
                }
                if (!(0, card_validators_1.validateEmailFormat)(cardData.email)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'El correo no tiene un formato válido' }));
                    return;
                }
                if ((0, card_validators_1.isExpire)(cardData.expiration_year) != true) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'El año de expiración de la tarjeta no puede ser mayor que el año en curso por más de 5 años o, en su defecto, no puede ser menor que el año en curso' }));
                    return;
                }
                if (!(0, card_validators_1.validateNumbersOnly)(cardData.card_number)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'El número de tarjeta sólo puede contener números' }));
                    return;
                }
                if (!(0, card_validators_1.isValidCardNumber)(cardData.card_number)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'El número de tarjeta no es válido' }));
                    return;
                }
                if (cardData.cvv.length < 3 || cardData.cvv.length > 4) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'El CVV debe tener un mínimo de 3 dígitos y un máximo de 4' }));
                    return;
                }
                if (!(0, card_validators_1.validateNumbersOnly)(cardData.cvv)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'El CVV sólo puede contener números' }));
                    return;
                }
                if (!(0, card_validators_1.cvvValidator)(cardData.card_number, cardData.cvv)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'El CVV no es válido' }));
                    return;
                }
                if (cardData.expiration_month < 1 || cardData.expiration_month > 12) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'El mes de expiración de la tarjeta debe estar entre 1 y 12' }));
                    return;
                }
                card_1.Card.create(cardData);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ token: tokenID }));
                return;
            }
        }
        catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: error }));
            return;
        }
    });
});
exports.postCard = postCard;
const getCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const parsedUrl = url_1.default.parse(req.url, true);
    const token = (_a = parsedUrl.pathname) === null || _a === void 0 ? void 0 : _a.split('/').pop();
    if (token) {
        card_1.Card.getCardByToken(token, (error, cardData) => {
            if (error) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'No existe la tarjeta' }));
                return;
            }
            else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(cardData));
                return;
            }
        });
    }
    else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Token no válido' }));
        return;
    }
});
exports.getCard = getCard;
//# sourceMappingURL=card.js.map