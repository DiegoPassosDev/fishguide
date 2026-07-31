# Manual da API (OpenAPI)

- **Projeto:** FishGuide
- **Versão:** 1.0

## 1. Objetivo

Definir os padrões oficiais da API do FishGuide.

A API será:

- RESTful; 
- versionada; 
- documentada automaticamente; 
- consistente; 
- segura; 
- preparada para futuras integrações. 

## 2. Convenções

Base URL

/api/v1

Exemplos:

- /api/v1/auth

/api/v1/users

/api/v1/fishing-trips

/api/v1/species

## 3. Versionamento

Toda mudança incompatível criará uma nova versão.

Exemplo.

/api/v1

/api/v2

Mudanças compatíveis continuarão na mesma versão.

## 4. Autenticação

JWT.

Fluxo.

Login
↓
Access Token
↓
Refresh Token
↓
Renovação

O frontend nunca armazenará informações sensíveis em texto simples.

## 5. Estrutura das Respostas

Toda resposta seguirá o mesmo padrão.

Sucesso.

{

  "success": true,

  "data": {},

  "meta": {},

  "timestamp": ""

}

Erro.

{

  "success": false,

  "error": {

    "code": "",

    "message": ""

  },

  "timestamp": ""

}

## 6. Paginação

Padrão.

?page=1

&limit=20

Resposta.

{

  "data": [],

  "pagination": {

    "page": 1,

    "limit": 20,

    "total": 200,

    "pages": 10

  }

}

## 7. Ordenação

?sort=name

?order=asc

Ou

?sort=fgScore

?order=desc

## 8. Filtros

Exemplos.

?species=robalo

?moon=crescente

?tide=enchente

?region=sergipe

Filtros poderão ser combinados.

## 9. Endpoints Principais

**Auth**

POST /auth/login

POST /auth/register

POST /auth/logout

POST /auth/refresh

POST /auth/forgot-password

**Alteração de senha** *(adicionado na implementação — 31/07/2026)*

POST /auth/change-password

- Autenticado (Bearer Token).
- Body: `currentPassword` e `newPassword` (mínimo 8 caracteres).
- Retorna `{ message }` ou 401 se a senha atual estiver incorreta.

**Usuários**

GET /users/me

PATCH /users/me

DELETE /users/me

*Status: GET e PATCH `/users/me` implementados; DELETE ainda não. `POST /auth/logout`, `POST /auth/refresh` e `POST /auth/reset-password` ainda não existem no backend.*

**Pesqueiros**

GET /fishing-spots

GET /fishing-spots/:id

POST /fishing-spots

PATCH /fishing-spots/:id

**Espécies**

GET /species

GET /species/:id

**Tela HOJE**

GET /today

Retorno.

FG Score; 

- clima; 
- maré; 
- lua; 
- sol; 
- vento; 
- pressão; 
- missão recomendada; 
- nível de confiança. 

**FG Score**

GET /fg-score

Parâmetros.

- local; 
- espécie; 
- horário; 
- data. 

**Pescarias**

GET /fishing-trips

POST /fishing-trips

GET /fishing-trips/:id

PATCH /fishing-trips/:id

DELETE /fishing-trips/:id

**Capturas**

POST /catches

PATCH /catches/:id

DELETE /catches/:id

**Comunidade**

GET /feed

POST /posts

POST /comments

POST /likes

**IA**

POST /assistant

## 10. Códigos HTTP

## 11. Rate Limiting

Exemplo inicial.

Login.

10 tentativas por minuto.

Consultas.

120 por minuto.

Uploads.

20 por hora.

Esses valores poderão ser ajustados.

## 12. Uploads

Endpoint.

POST /uploads

Aceitos.

JPEG; 

- PNG; 
- WebP; 
- HEIC (quando suportado). 

Processamento:

- compressão; 
- geração de miniaturas; 
- remoção de metadados sensíveis (como coordenadas GPS), salvo quando o usuário optar explicitamente por preservá-los. 

## 13. Webhooks (Futuro)

Eventos.

Nova Captura

Nova Missão

Nova Recomendação

Novo Parceiro

## 14. Documentação

Toda API será documentada automaticamente.

Swagger.

OpenAPI 3.1.

Sempre sincronizados com o código.

## 15. Convenções de Nome

URLs.

- fishing-trips

- fishing-spots

- fish-species

JSON.

- camelCase

Banco.

- snake_case

## 16. Idempotência

Operações críticas poderão utilizar uma chave de idempotência.

Exemplo.

Registro de captura.

Mesmo que o usuário envie duas vezes por instabilidade da conexão.

Apenas um registro será criado.

## 17. Cache

Endpoints.

GET /today

GET /species

GET /moon

GET /tides

Poderão utilizar cache.

## 18. Observabilidade

Cada requisição possuirá.

Request ID; 

- Tempo de resposta; 
- Usuário autenticado (quando aplicável); 
- Status; 
- Origem. 

Facilitando auditorias e diagnósticos.

## 19. SDK Futuro

A arquitetura permitirá gerar automaticamente SDKs.

Exemplos.

TypeScript; 

- Kotlin; 
- Swift; 
- Python. 

Todos derivados da especificação OpenAPI.

## 20. Minha sugestão mais importante

**API Semântica**

Além dos endpoints tradicionais.

O FishGuide poderá oferecer endpoints de alto nível.

Exemplo.

Ao invés de.

GET /weather

GET /tides

GET /moon

Teremos.

GET /today

O backend reúne todas as informações necessárias.

Isso simplifica muito o frontend.

Outro exemplo.

POST /mission/simulate

Ao invés de várias chamadas.

O servidor executa todo o planejamento.

## 21. API para o Futuro

Quando o FishGuide crescer.

Poderemos adicionar.

GraphQL.

Sem remover a REST API.

Cada tecnologia atenderá diferentes necessidades.

## 22. API Pública

No futuro.

Uma parte da API poderá ser pública.

Exemplos.

- espécies; 
- informações institucionais; 
- dados agregados; 
- parceiros. 

Nunca informações privadas.

## 23. O recurso que considero revolucionário

**API de Conhecimento**

Hoje pensamos em APIs que retornam dados.

Mas o FishGuide poderá retornar **conhecimento**.

Exemplo.

GET /insights/species/robalo

Resposta.

- melhor horário; 
- melhor maré; 
- melhor lua; 
- tendência histórica; 
- nível de confiança; 
- recomendações baseadas na Memória Coletiva da Pesca. 

Não é apenas uma consulta.

É uma interpretação construída pelo sistema.

|  Código  |                     Significado                      |
|----------|------------------------------------------------------|
| 200      | OK                                                   |
| 201      | Criado                                               |
| 204      | Sem conteúdo                                         |
| 400      | Requisição inválida                                  |
| 401      | Não autenticado                                      |
| 403      | Sem permissão                                        |
| 404      | Não encontrado                                       |
| 409      | Conflito                                             |
| 422      | Dados válidos, mas rejeitados por regra de negócio   |
| 429      | Limite de requisições excedido                       |
| 500      | Erro interno                                         |