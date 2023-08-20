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
exports.Server = void 0;
const http_1 = __importDefault(require("http"));
const validators_1 = require("../middlewares/validators");
const card_1 = require("../controllers/card");
const serverless_http_1 = __importDefault(require("serverless-http"));
class Server {
    constructor() {
        this.server = http_1.default.createServer(this.requestHandler);
    }
    requestHandler(req, res) {
        var _a;
        // Permitir cualquier origen
        res.setHeader('Access-Control-Allow-Origin', '*');
        // Permitir métodos específicos
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        // Permitir encabezados específicos
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        if (req.method === 'OPTIONS') {
            // Si es una solicitud de opciones preflight, responde con éxito
            res.writeHead(200);
            res.end();
            return;
        }
        if (req.method === 'GET' && ((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith('/tokens/'))) {
            const token = req.url.split('/')[2];
            if (!token) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Token no existe o no es válido' }));
                return;
            }
            // Validamos el token enviado en los headers
            (0, validators_1.validToken)(req, res, () => {
                (0, card_1.getCard)(req, res);
            });
        }
        else if (req.method === 'POST' && req.url === '/tokens') {
            // Validamos el token enviado en los headers
            (0, validators_1.validToken)(req, res, () => {
                (0, card_1.postCard)(req, res);
            });
        }
        else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Método no permitido' }));
        }
    }
    start(port) {
        this.server.listen(port, () => {
            console.log(`Servidor escuchando en el puerto: ${port}`);
        });
    }
    // Función que actuará como handler para la función Lambda serverRoutesFunction
    serverRoutesFunction(event, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const appHandler = (0, serverless_http_1.default)(this.server);
            return yield appHandler(event, context);
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map