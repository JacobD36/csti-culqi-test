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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const config_1 = require("../database/config");
class Card {
    static create(cardData) {
        const { token, email, card_number, cvv, expiration_month, expiration_year } = cardData;
        const obj = {
            token,
            email,
            card_number,
            cvv,
            expiration_month,
            expiration_year
        };
        config_1.redisClient.hSet(`card:${token}`, obj).then(res => {
            config_1.redisClient.expire(`card:${token}`, 900);
        });
    }
    ;
    static getCardByToken(token, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield config_1.redisClient.hGetAll(`card:${token}`).then((res) => {
                if (res) {
                    if (res.card_number) {
                        callback(null, res);
                    }
                    else {
                        callback(new Error('No existe la tarjeta'), null);
                    }
                }
                else {
                    callback(new Error('No existe la tarjeta'), null);
                }
            }).catch((err) => {
                console.log(err);
            });
        });
    }
}
exports.Card = Card;
//# sourceMappingURL=card.js.map