import { Server } from './models/server';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;
const server = new Server();

server.start(PORT);

// Exportamos la constante routesFunction para que pueda ser utilizada por la función Lambda
export const routesFunction = server.serverRoutesFunction.bind(server);