# FishGuide

Sistema inteligente de planejamento de pescarias — monorepo com NestJS (backend), Next.js (frontend), PostgreSQL + PostGIS, Prisma ORM e Redis.

## Stack

- **Backend:** NestJS 11 + Prisma 7 + PostgreSQL 16 + PostGIS
- **Frontend:** Next.js 16 + React 19 + Tailwind CSS 4 + shadcn/ui
- **Cache:** Redis 7
- **Gerenciamento:** pnpm monorepo

## Início rápido

```bash
docker compose up -d     # Inicia PostgreSQL + Redis
pnpm install              # Instala dependências
pnpm dev                  # Backend (3001) + Frontend (3000)
```

## Estrutura

```
fishguide/
├── packages/
│   ├── backend/     → API REST (NestJS)
│   └── frontend/    → Aplicação web (Next.js)
├── docs/            → Documentação técnica
├── docker-compose.yml
└── pnpm-workspace.yaml
```

## Licença

AGPL-3.0 — veja [LICENSE](LICENSE).
