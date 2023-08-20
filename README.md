# CSTI - Culqi - Prueba Técnica Backend Senior
***
## Introducción

El siguiente código responde a lo solicitado en la Prueba Técnica Backend Senior.

## NodeJS

Se utilizó NodeJS en su versión 18.16.0.

## Rutas y Endpoints

### Main API endpoint access:

```
    http://localhost:3000
```

### Rutas de acceso:

```
    POST: cards: '/tokens',  // Creación de token
    GET: cards: '/tokens/{id}' // Obtención de datos de tarjeta a través de un token
```

### Acceso a la base de datos:

El acceso a la base de datos está definido en el archivo de variables de entorno .env en la raíz del proyecto.

### Variables de entorno

El archivo .env, el cual define las variables de entorno, define las siguientes variables globales:

```
    PORT=3000 // Puerto de acceso a la API
    REDIS_URL=redis://localhost:6379 // Cadena de conexión a la base de datos Redis
```

## Instalación

Para instalar el proyecto, se debe clonar el repositorio y ejecutar el siguiente comando en la raíz del proyecto:

```
    npm install
```

## Compilación

Para compilar el proyecto, se debe ejecutar el siguiente comando en la raíz del proyecto:

```
    npm run build
```

## Ejecución

Para ejecutar el proyecto, se debe ejecutar el siguiente comando en la raíz del proyecto:

```
    npm start
```

## Ejecución de pruebas unitarias

Para ejecutar las pruebas unitarias, se debe ejecutar el siguiente comando en la raíz del proyecto:

```
    npx jest
```

## Ejecutar contenedor Redis con Docker

Para ejecutar el contenedor Redis con Docker, se debe ejecutar el siguiente comando en la raíz del proyecto:

```
    docker-compose up -d
```

## Serverless Offline

Para ejecutar el proyecto en modo serverless offline, se debe ejecutar el siguiente comando en la raíz del proyecto:

```
    npm run offline
```

## Pruebas en Postman

Se incluye el archivo CSTI-Culqi.postman_collection.json en la raíz del proyecto, el cual contiene las pruebas y endpoints establecidos y clasificados, con información de muestra realizadas en Postman.

## Autor
* **Jaime Arturo Pérez Frias** - *Desarrollador Backend*