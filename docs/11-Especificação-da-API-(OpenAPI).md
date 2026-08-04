# Especificação da API (OpenAPI)

- **Projeto:** FishGuide
- **Versão:** 1.0
- **Domínio:** Application
- **Status:** Approved
- **Proprietário:** Diego Passos
- **Última revisão:** 2026-08-03

## 1. Objetivo

Definir o padrão de comunicação entre o Frontend, Backend e futuras integrações externas.

A API será RESTful, documentada automaticamente com Swagger/OpenAPI e preparada para evolução por versionamento.

Base URL:

- https://api.fishguide.com.br/api/v1

## 2. Padrões Gerais

**Formato**

Todas as requisições e respostas utilizarão JSON.

**Exemplo**

{

  "success": true,

  "data": {},

  "message": null,

  "meta": {}

}

**Datas**

Sempre em ISO 8601.

Exemplo:

- 2026-09-18T05:45:00-03:00

**Coordenadas**

Sempre em decimal.

{

  "latitude": -10.982,

  "longitude": -37.073

}

**Paginação**

Padrão:

- GET /species?page=1&limit=20

Resposta:

- {

  "data": [],

  "meta": {

    "page": 1,

    "limit": 20,

    "total": 380,

    "pages": 19

  }

}

## 3. Autenticação

**Login**

POST /auth/login

Request

{

  "email": "usuario@email.com",

  "password": "********"

}

Response

{

  "accessToken": "...",

  "refreshToken": "...",

  "expiresIn": 3600

}

**Refresh Token**

POST /auth/refresh

**Logout**

POST /auth/logout

**Cadastro**

POST /auth/register

**Recuperação de senha**

POST /auth/forgot-password

POST /auth/reset-password

**Alteração de senha**

POST /auth/change-password

Request:

- currentPassword
- newPassword (mínimo 8 caracteres)

Requer autenticação (Bearer Token).

## 4. Usuários

**Listar perfil**

GET /users/me

Atualizar

PATCH /users/me

*Implementado na versão atual.* `PATCH /users/me` aceita: name, phone, bio, city, state, country, avatar, privacy (public/friends/private) e birthDate.

Favoritos

GET /users/me/favorites

Estatísticas

GET /users/me/statistics

Equipamentos

GET /users/me/equipment

## 5. Tela HOJE

Este será o endpoint mais importante do sistema.

GET /today

Resposta:

- {

  "score": 92,

  "confidence": 96,

  "recommendation": "Excelente dia para pesca.",

  "bestSpot": {},

  "bestSpecies": [],

  "bestTime": {},

  "weather": {},

  "tide": {},

  "moon": {},

  "alerts": []

}

Esse endpoint será responsável por montar praticamente toda a tela inicial.

## 6. Locais

GET /spots

Filtros:

- latitude 
- longitude 
- raio 
- espécie 
- ambiente 
- acessibilidade 

Detalhes

GET /spots/:id

Avaliações

GET /spots/:id/reviews

Fotos

GET /spots/:id/photos

## 7. Espécies

GET /species

Detalhes

GET /species/:id

Espécies de um local

GET /spots/:id/species

## 8. Diário

Criar pescaria

POST /trips

Listar

GET /trips

Detalhes

GET /trips/:id

Editar

PATCH /trips/:id

Excluir

DELETE /trips/:id

## 9. Capturas

Adicionar captura

POST /trips/:id/catches

Editar

PATCH /catches/:id

Excluir

DELETE /catches/:id

## 10. Comunidade

Feed

GET /community/feed

Nova publicação

POST /community/posts

Comentários

POST /community/posts/:id/comments

Curtir

POST /community/posts/:id/like

## 11. Eventos

GET /events

POST /events

## 12. Mapa

Locais próximos

GET /map/nearby

Rota

GET /map/route

## 13. Clima

GET /weather

Previsão

GET /weather/forecast

## 14. Marés

GET /tides

## 15. Astronomia

GET /astronomy

## 16. Pesquisa Global

GET /search

Parâmetros:

- texto 
- espécie 
- local 
- usuário 
- raio 

## 17. Notificações

GET /notifications

Marcar como lida

PATCH /notifications/:id/read

## 18. Upload

POST /upload

Resposta

{

  "url": "https://storage..."

}

## 19. Padrão de Erros

Todos os erros seguirão o mesmo formato.

{

  "success": false,

  "error": {

    "code": "FG-401",

    "message": "Token expirado.",

    "details": null

  }

}

## 20. Versionamento

Sempre:

- /api/v1

Novas versões:

- /api/v2

/api/v3

## 21. Rate Limit

Exemplo:

- Login. 

Cadastro. 

Recuperação de senha. 

Terão limites específicos.

## 22. WebSocket

Eventos:

- Nova mensagem. 

Nova captura compartilhada. 

Comentário. 

Evento criado. 

Notificação. 

Atualização da tela **HOJE** quando houver mudanças significativas. 

## 23. APIs Internas (Motor Inteligente)

Esses endpoints serão utilizados apenas internamente pelo backend.

Exemplos:

- /calculate-score

/generate-recommendation

/build-today

/calculate-confidence

/create-snapshot

## 24. Endpoints Administrativos

Aprovar pesqueiros. 

Aprovar contribuições da comunidade. 

Moderar publicações. 

Gerenciar espécies. 

Gerenciar tags. 

Gerenciar usuários. 

Consultar métricas do sistema.