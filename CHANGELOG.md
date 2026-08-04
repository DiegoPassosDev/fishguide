# Changelog

Todas as mudanças notáveis do FishGuide são documentadas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

> Este projeto não publica releases versionados no momento; as seções são organizadas por data de merge na `main`. A versão de produto exibida no aplicativo é 1.0.0.

## [Unreleased]

### Adicionado
- Módulo Diário (`/diary`): histórico cronológico de pescarias, estatísticas básicas, detalhes da pescaria, edição/exclusão e FAB "Pescar" expansível com atalhos Diário/Iniciar *(branch `feature/diary`, aguardando merge)*.

## [2026-08-03]

### Adicionado
- **Comunidade** (PR #8): feed organizado por assuntos (chips), criar publicação, curtir, comentar, compartilhar e seguir usuários (mock).
- **Registro de pescarias** (`/pescar`, PR #9): fluxo "Estou Pescando" — iniciar/finalizar pescaria, cronômetro, capturas (espécie, peso, comprimento, foto, observações), edição/exclusão de capturas, local com geolocalização e snapshot automático de clima, maré, lua, pressão e vento (mock). Pescaria finalizada salva no `localStorage`.

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
