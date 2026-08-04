# Changelog

Todas as mudanças notáveis do FishGuide são documentadas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

> Este projeto não publica releases versionados no momento; as seções são organizadas por data de merge na `main`. A versão de produto exibida no aplicativo é 1.0.0.

## [Unreleased]

## [2026-08-04]

### Adicionado
- **Módulo Pesqueiros** (PR #13): API pública de pesqueiros (`GET /api/v1/fishing-spots`, `GET /api/v1/fishing-spots/:id`), integração do mapa com dados reais do banco, seed com 6 pesqueiros e detalhes com espécies navegáveis.
- **Módulo Espécies** (PR #14): catálogo com listagem, busca e página de detalhe (`/species`); API pública `GET /api/v1/species` (busca, filtro por habitat, paginação) e CRUD restrito a ADMIN/SPECIALIST; seed ampliado para 8 espécies; fotos reais (Wikimedia Commons) no banner do detalhe e nas miniaturas da lista.

### Alterado
- `docker-compose.yml`: serviço `postgres` com `restart: always`, iniciando junto com o Docker Desktop.

## [2026-08-03]

### Adicionado
- **Comunidade** (PR #8): feed organizado por assuntos (chips), criar publicação, curtir, comentar, compartilhar e seguir usuários (mock).
- **Registro de pescarias** (`/pescar`, PR #9): fluxo "Estou Pescando" — iniciar/finalizar pescaria, cronômetro, capturas (espécie, peso, comprimento, foto, observações), edição/exclusão de capturas, local com geolocalização e snapshot automático de clima, maré, lua, pressão e vento (mock). Pescaria finalizada salva no `localStorage`.
- **Módulo Diário** (`/diary`, PR #10): histórico cronológico de pescarias em cards, estatísticas básicas, modal de detalhes com capturas, edição/exclusão, dados em `localStorage` e FAB "Pescar" expansível com atalhos Diário/Iniciar.
- **Padronização da documentação** (PR #11): `CHANGELOG.md` criado (Keep a Changelog), `docs/README.md` reescrito com índice por domínios TOGAF e cabeçalho padrão (Domínio, Status, Proprietário, Última revisão) nos 31 documentos.
- Correção (PR #12): usuários não autenticados redirecionados para o login na página de perfil.

## [2026-07-31]

### Adicionado
- **Módulo Perfil** (PR #6): visualização e edição de perfil (`PATCH /users/me`), troca de senha (`POST /auth/change-password`), preferências de tema/unidades/notificações, logout, card Sobre (v1.0.0).
- **Tema claro/escuro** aplicado a todas as telas, incluindo autenticação.
- **Mapa** (`/map`, PR #7): mapa estilizado (mock SVG), busca, filtros por categoria, localização e locais próximos.
- Correção: `POST /auth/forgot-password` agora valida se o e-mail é cadastrado.

## [2026-07-30]

### Adicionado
- **Autenticação frontend completa** (PR #4): splash, login, cadastro, recuperação de senha e autenticação JWT integrada ao backend.
- **Tela HOJE / TodayDashboard** (`/today`, PR #5): índice FG, períodos solunares, gráfico de marés, clima, astronomia, cartões de recomendação e dados mock.

## [2026-07-29]

### Adicionado
- **Estrutura inicial**: monorepo (NestJS + Next.js + Prisma + PostgreSQL + Redis + Docker).
- **Documentação**: conversão das especificações para Markdown e diagramas Mermaid (PR #1 e #2).
- **Autenticação backend** (PR #3): módulo de registro/login com JWT, Prisma e Swagger.

---

### Tipos de mudança

- **Adicionado** — novas funcionalidades.
- **Corrigido** — correções de bugs.
- **Alterado** — mudanças em funcionalidades existentes.
- **Removido** — funcionalidades retiradas.
