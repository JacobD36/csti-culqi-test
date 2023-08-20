import { redisClient } from '../database/config';

export class Card {
    static create(cardData: {
        token: string;
        email: string;
        card_number: number;
        cvv: number;
        expiration_month: number;
        expiration_year: number;
    }) {
        const {
            token,
            email,
            card_number,
            cvv,
            expiration_month,
            expiration_year
        } = cardData;

        const obj: Record<string, string | number> = {
            token,
            email,
            card_number,
            cvv,
            expiration_month,
            expiration_year
        }

        redisClient.hSet(`card:${token}`, obj).then(res => {
            redisClient.expire(`card:${token}`, 900);
        });
    };

    static async getCardByToken(token: string, callback: (error: Error | null, cardData: any | null) => void) {
        await redisClient.hGetAll(`card:${token}`).then((res) => {
            if(res) {
                if(res.card_number) {
                    callback(null, res);
                } else {
                    callback(new Error('No existe la tarjeta'), null);
                }
            } else {
                callback(new Error('No existe la tarjeta'), null);
            }
        }).catch((err) => {
            console.log(err);
        });
    }
}