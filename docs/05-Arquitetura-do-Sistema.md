# Arquitetura do Sistema

- **Projeto:** FishGuide
- **Versão:** 1.0

## 1. Objetivo

Definir a arquitetura técnica do FishGuide, estabelecendo padrões de organização do código, comunicação entre módulos, infraestrutura e tecnologias.

## 2. Arquitetura Geral

O FishGuide será composto por quatro grandes camadas:

-               Usuário
                   ↓
             Frontend (Next.js)
                   │
          HTTPS / REST / WebSocket
                   ↓
            Backend (NestJS)
                   │
        ┌──────────┼──────────┐
        ↓          ↓          ↓
    PostgreSQL   Redis  APIs Externas

## 3. Stack Tecnológica

**Frontend**

Next.js (App Router) 

React 

TypeScript 

Tailwind CSS 

- shadcn/ui 

TanStack Query 

React Hook Form 

Zod 

Leaflet 

Zustand 

**Backend**

NestJS 

Prisma ORM 

PostgreSQL 

Redis 

BullMQ 

JWT 

Passport 

Swagger 

**Infraestrutura**

Docker 

Docker Compose 

GitHub 

GitHub Actions 

Vercel (Frontend) 

VPS/Railway/Render (Backend) 

## 4. Organização do Repositório

- fishguide/

- backend/
- frontend/
- docs/
- docker/
- scripts/

README.md

- docker-compose.yml

## 5. Frontend

Estrutura proposta:

- frontend/

- src/

- app/

- components/

- features/

- hooks/

- services/

- stores/

- types/

- utils/

- styles/

- assets/

**Components**

Componentes reutilizáveis.

Exemplo:

- Button

Card

Modal

Dialog

Avatar

Map

WeatherCard

MoonCard

TideCard

FishingScore

**Features**

Separação por domínio.

- auth

- dashboard

- community

- weather

- tides

- astronomy

- species

- spots

- trips

- events

- admin

**Stores**

Gerenciamento de estado.

- auth

- map

- filters

- notifications

- user

## 6. Backend

Estrutura:

- backend/

- src/

- modules/

- common/

- config/

- jobs/

- database/

- storage/

- main.ts

## 7. Organização dos Módulos

- modules/

- auth

- users

- weather

- tides

- astronomy

- species

- spots

- baits

- equipment

- trips

- community

- chat

- notifications

- events

- ranking

- ai

- admin

Cada módulo será independente.

Cada um terá:

- controller

- service

- repository

- dto

- entities

- mapper

- validators

- tests

## 8. APIs Externas

O FishGuide consumirá diversas APIs.

Cada integração ficará isolada.

- external/

- weather/

- marine/

- moon/

- maps/

- geocoding/

Nunca chamaremos uma API diretamente de um módulo de negócio.

Toda integração passará por uma camada específica.

## 9. Cache

Redis será utilizado para:

- clima; 
- maré; 
- lua; 
- mapas; 
- locais populares; 
- ranking; 
- consultas frequentes. 

Tempo de cache configurável por tipo de informação.

## 10. Filas (BullMQ)

Algumas tarefas não devem bloquear o usuário.

Exemplos:

- baixar previsão do tempo; 
- atualizar marés; 
- gerar miniaturas de imagens; 
- enviar notificações; 
- recalcular índices; 
- enviar e-mails. 

## 11. Upload de Imagens

As imagens não serão armazenadas no banco.

Fluxo:

- Usuário
↓
Upload
↓
Storage
↓
Banco salva somente URL

Armazenamento futuro:

- Cloudflare R2 

Amazon S3 

Backblaze B2 

## 12. Autenticação

JWT

Refresh Token

OAuth Google

No futuro:

- Apple

GitHub

## 13. Autorização

RBAC

Perfis:

- Administrador

Moderador

Usuário

Visitante

## 14. WebSocket

Será utilizado para:

- Chat

Notificações

Eventos em tempo real

Atualização do mapa

Alertas

## 15. Logs

Todos os eventos importantes serão registrados.

Exemplos:

- Login.

Alterações.

Uploads.

Denúncias.

Erros.

Integrações.

## 16. Monitoramento

Ferramentas sugeridas:

- Sentry 

Grafana 

Prometheus 

## 17. Docker

Teremos containers independentes.

Frontend

Backend

PostgreSQL

Redis

Nginx

## 18. CI/CD

GitHub Actions.

Pipeline:

- Commit
↓
Testes
↓
Lint
↓
Build
↓
Deploy

## 19. Segurança

HTTPS obrigatório.

Rate Limit.

CSRF.

CORS.

Helmet.

Validação de DTOs.

Sanitização.

Soft Delete.

Auditoria.

## 20. Banco de Dados

PostgreSQL.

Prisma.

PostGIS.

UUID.

Migrações versionadas.

## 21. API

REST como padrão.

Estrutura:

- /api/v1/users

/api/v1/weather

/api/v1/tides

/api/v1/species

/api/v1/spots

/api/v1/trips

/api/v1/community

## 22. Versionamento

Toda alteração incompatível criará uma nova versão da API.

Exemplo:

- v1

- v2

- v3

## 23. Estratégia para APIs Externas

Esta é uma decisão importante.

O FishGuide **não dependerá diretamente das APIs externas** para funcionar.

Fluxo:

- API Externa
↓
Jobs
↓
Banco de Dados
↓
Cache
↓
Frontend

Isso significa que, quando o usuário abrir o sistema, ele consultará primeiro os dados armazenados localmente. As APIs externas serão usadas para sincronizar e atualizar essas informações periodicamente. Essa estratégia reduz custos, melhora o desempenho e mantém o sistema funcional mesmo quando uma API estiver temporariamente indisponível.

## 24. Arquitetura para IA

Desde o início, prepararemos uma camada exclusiva para inteligência.

AI
↓
Motor de Regras
↓
Machine Learning
↓
Recomendações
↓
Dashboard

Inicialmente, o índice de pesca será baseado em regras de negócio. No futuro, essa camada poderá incorporar modelos de aprendizado de máquina treinados com o histórico da comunidade, sem necessidade de alterar os demais módulos.

## 25. Estrutura dos Ambientes

Teremos três ambientes independentes:

- Desenvolvimento
↓
Homologação
↓
Produção

Cada ambiente possuirá banco de dados, armazenamento e configurações próprias.

## 26. Arquitetura de Permissões

Além dos perfis (Administrador, Moderador, Usuário), proponho adotar permissões granulares.

Exemplos:

- species:create 
- species:update 
- spot:approve 
- community:moderate 
- event:create 

Isso oferece flexibilidade para criar novos perfis futuramente sem alterar o código.

## 27. Sistema de Plugins (Visão de Longo Prazo)

Uma ideia que considero interessante é projetar o FishGuide para permitir novos módulos no futuro.

Exemplos:

- Torneios de pesca. 

Marketplace de equipamentos. 

Loja de iscas. 

Integração com sonares. 

Integração com relógios esportivos. 

Sensores embarcados. 

Esses recursos poderiam ser adicionados como módulos independentes, preservando a estabilidade do núcleo do sistema.