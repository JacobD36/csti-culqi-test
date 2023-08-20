"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cvvValidator = exports.getCardType = exports.isValidCardNumber = exports.validateEmailFormat = exports.validateNumbersOnly = exports.isExpire = exports.validMonths = void 0;
// Meses válidos para ser recepcionados en la petición
exports.validMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
/**
 * Valida que el año de expiración cumpla con las reglas del negocio
 * @param { Number } year
 * @returns { Boolean }
 */
const isExpire = (year) => {
    const currentYear = new Date().getFullYear();
    if (year >= currentYear + 5) {
        return false;
    }
    if (year < currentYear) {
        return false;
    }
    return true;
};
exports.isExpire = isExpire;
/**
 * Valida que el número de la tarjeta sólo contenga números
 * @param { String } input
 * @returns
 */
const validateNumbersOnly = (input) => {
    return /^[0-9]+$/.test(input);
};
exports.validateNumbersOnly = validateNumbersOnly;
/**
 * Valida el formato de un correo electrónico
 * @param { String }email
 * @returns
 */
const validateEmailFormat = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};
exports.validateEmailFormat = validateEmailFormat;
/**
 * Valida el formato del número de tarjeta utilizando el algoritmo de Luhn
 * @param { String } cardNumber
 * @returns { Boolean }
 */
const isValidCardNumber = (cardNumber) => {
    const cleanedCardNumber = cardNumber.replace(/\s/g, '');
    if (!/^\d+$/.test(cleanedCardNumber)) {
        return false;
    }
    const digits = cleanedCardNumber.split('').map(Number);
    const length = digits.length;
    let sum = 0;
    let shouldDouble = false;
    for (let i = length - 1; i >= 0; i--) {
        let digit = digits[i];
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
};
exports.isValidCardNumber = isValidCardNumber;
/**
 * Retorna el tipo de tarjeta
 * @param { String }cardNumber
 * @returns { String }
 */
const getCardType = (cardNumber) => {
    if (cardNumber.startsWith('4')) {
        return 'VISA';
    }
    else if (cardNumber.startsWith('5')) {
        return 'MASTERCARD';
    }
    else {
        return 'OTRA';
    }
};
exports.getCardType = getCardType;
/**
 * Valida si el CVV corresponde al tipo de tarjeta
 * @param { any } card_number
 * @param { any } cvv
 */
const cvvValidator = (card_number, cvv) => {
    const card_type = (0, exports.getCardType)(card_number);
    if (card_type && cvv) {
        if (card_type === 'VISA' || card_type === 'MASTERCARD') {
            if (cvv.length > 3) {
                return false;
            }
        }
        else {
            if (cvv.length > 4) {
                return false;
            }
        }
    }
    return true;
};
exports.cvvValidator = cvvValidator;
//# sourceMappingURL=card-validators.js.map