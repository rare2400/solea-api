# Solea lagersystem API med Fastify och MongoDB
Detta är ett RESTful API byggt med Fastify och MongoDb. Webbtjänsten hanterar produkter i lagersystem med 
användare som "admin" och "staff". Produkt- och användardata stöds av full CRUD-funktionalitet (Create, Read, Update, Delete).
Data skyddas av JWT och inloggad användare krävs för att kunna hantera produkter, samt användarrollen "admin"
krävs för att lägga till, ändra och radera andr användare.

[Länk till publicerat API]()

## Verktyg
* Node.js (ESM)
* Fastify
* MongoDB (via @fastify/mongodb)
* JSON Schema validering
* JWT-autentisering
* bcrypt
* cors

## Installation
1. **Klona Repo**
```bash     
git clone https://github.com/rare2400/solea-api.git
```
2. **Installera beroenden:**
```bash     
npm install
```

3. **Skapa `.env`-fil i rotmappen och fyll i databasuppgifter:**

| Variabel        | Beskrivning                     |
|-----------------|---------------------------------|
| `PORT=`         | Porten servern lyssnar på       |
| `DATABASE_URL=` | Anslutningssträng till MongoDB  |
| `JWT_SECRET=`   | Hemlig JWT-nyckel               |

4. **Starta server**
```bash
npm run dev
```

## Projektstruktur
```
fastify-movieapi/
│
├── server.js
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── productController.js
│   ├── plugins/
│   │   └── mongo.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── productRoutes.js
│   ├── schemas/
│   │   ├── authSchema.js
│   │   └── productSchema.js
│   └── utils/
│       ├── errorHandler.js
│       ├── getCollection.js
│       └── parseId.js
├── .env
└── package.json
```

## API Endpoints
### Auth

| Metod    | Endpoint            | Skyddad  | Beskrivning
| -------- | --------------------|----------|------------------------------------ |
| GET      | /auth/users         | Admin    | Hämta alla användare                |
| GET      | /auth/profile       | JWT      | Hämta inloggad användares profil    |
| POST     | /auth/register      | Admin    | Registrera ny användare             |
| POST     | /auth/login         | Nej      | Logga in existerande användare      |
| PUT      | /auth/users/:id     | JWT      | Uppdatera befintlig användare       |
| DELETE   | /auth/users/:id     | Admin    | Radera användare med ID             |

## Produkter

| Metod  | Endpoint             | Skyddad | Beskrivning                   |
|--------|----------------------|---------|-------------------------------|
| GET    | /products            | JWT     | Hämtar alla produkter         |
| GET    | /products/categories | JWT     | Hämtar alla produktkategorier |
| GET    | /products/:id        | JWT     | Hämtar en produkt med ID      |
| POST   | /products            | JWT     | Lägger till en ny produkt     |
| PUT    | /products/:id        | JWT     | Uppdaterar en produkt         |
| DELETE | /products/:id        | JWT     | Tar bort en produkt           |
| PATCH  | /products/:id /stock | JWT     | Uppdaterar lagersaldo         |

**Registrera användare**

```json
POST /auth/register
{
    "firstname": "Eva",
    "lastname": "Svensson",
    "email": "eva@solea.se",
    "password": "123456",
    "role": "admin"
}
```

**Uppdatera lagersaldo** (lägger till 2 saldo)
```json
PATCH /products/:id/stock
{
  "stock": 2
}
```

## Testning
API:t kan testas med program som:
- Thunder Client (vsc extension)
- Postman
- Advanced REST Client

## Skapad av
Skapad som en del av en skoluppgift   
Mittuniversitetet, Webbutvecklingsprogrammet    
Ramona Reinholdz   
[rare2400@student.miun.se](rare2400@student.miun.se)      
2026-05-29
