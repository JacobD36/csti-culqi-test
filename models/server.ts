import http, {Server as HTTPServer, IncomingMessage, ServerResponse } from 'http';
import { validToken } from '../middlewares/validators';
import { getCard, postCard } from '../controllers/card';
import ServerlessHttp from 'serverless-http';

export class Server {
    private server: any;

    constructor() {
        this.server = http.createServer(this.requestHandler);
    }

    private requestHandler(req: IncomingMessage, res: ServerResponse) {
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
        
        if(req.method === 'GET' && req.url?.startsWith('/tokens/')) {   
            const token = req.url.split('/')[2];
            if(!token) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Token no existe o no es válido' }));
                return;
            }
            // Validamos el token enviado en los headers
            validToken(req, res, () => {
                getCard(req, res);
            });
        } else if(req.method === 'POST' && req.url === '/tokens') {
            // Validamos el token enviado en los headers
            validToken(req, res, () => {
                postCard(req, res);
            });
            
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Método no permitido' }));
        }
    }

    public start(port: any) {
        this.server.listen(port, () => {
            console.log(`Servidor escuchando en el puerto: ${port}`);
        });
    }

    // Función que actuará como handler para la función Lambda serverRoutesFunction
    public async serverRoutesFunction(event: any, context: any) {
        const appHandler = ServerlessHttp(this.server);
        return await appHandler(event, context);
    }
}