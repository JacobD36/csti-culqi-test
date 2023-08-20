"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routesFunction = void 0;
const server_1 = require("./models/server");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const server = new server_1.Server();
server.start(PORT);
// Exportamos la constante routesFunction para que pueda ser utilizada por la función Lambda
exports.routesFunction = server.serverRoutesFunction.bind(server);
//# sourceMappingURL=app.js.map