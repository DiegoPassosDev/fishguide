# FishGuide — Documentação

Sistema Inteligente de Planejamento de Pescarias.

> Documentos convertidos dos originais `.docx` para Markdown.
> Os arquivos `.docx` originais permanecem apenas na pasta `documentos/` (local, não versionada).

---

## Índice

| # | Documento | Descrição |
|---|-----------|-----------|
| 00 | [Constituição do FishGuide](./00-Constituição-do-FishGuide.md) | 25 leis fundamentais — princípios, ética, valores e limites do sistema |
| 01 | [Visão Geral do Projeto](./01-Visão-Geral-do-Projeto.md) | Visão, objetivos, público-alvo, problema/solução, stack tecnológica |
| 02 | [Requisitos do Sistema](./02-Requisitos-do-Sistema.md) | 60 RFs, 14 RNFs, 8 RNs — tudo que o sistema deve fazer |
| 03 | [Casos de Uso e Fluxos](./03-Casos-de-Uso-e-Fluxos-do-Sistema.md) | 13 casos de uso, atores, fluxos principal/alternativo/exceção |
| 04 | [Modelagem do Banco de Dados](./04-Modelagem-do-Banco-de-Dados.md) | Entidades, tabelas, campos, tipos — domínios do sistema |
| 05 | [Arquitetura do Sistema](./05-Arquitetura-do-Sistema.md) | Arquitetura em 4 camadas, stack, monorepo, Docker, CI/CD |
| 06 | [Arquitetura da Interface (UX)](./06-Arquitetura-da-Interface-(UX).md) | Estrutura de navegação, telas, componentes reutilizáveis, estados |
| 07 | [Integrações Externas](./07-Integrações-Externas-e-Arquitetura-das-APIs.md) | APIs de clima, marés, astronomia, mapas — adapter pattern, cache |
| 08 | [Experiência do Usuário e Navegação](./08-Arquitetura-da-Experiência-do-Usuário-(UX)-e-Fluxos-de-Navegação.md) | Filosofia da tela HOJE, menu simplificado, timeline de pesca |
| 09 | [Motor Inteligente de Pesca](./09-Motor-Inteligente-de-Pesca-(Fishing-Intelligence-Engine).md) | 5 camadas de inteligência, FG Score, regras configuráveis |
| 10 | [Roadmap do Produto](./10-Roadmap-do-Produto.md) | MVP → v0.5 → v1.0 → v1.5 → v2.0 → v3.0 |
| 11 | [Especificação da API (OpenAPI)](./11-Especificação-da-API-(OpenAPI).md) | Endpoints RESTful, autenticação, paginação, WebSocket |
| 12 | [Arquitetura do Frontend](./12-Arquitetura-do-Frontend.md) | Next.js App Router, features, widgets, tema, estados |
| 13 | [Arquitetura do Backend](./13-Arquitetura-do-Backend.md) | Módulos NestJS, camadas DDD, barramento de eventos |
| 14 | [Modelo Entidade-Relacionamento](./14-Modelo-Entidade-Relacionamento-(ER).md) | FishingTrip como entidade central, FishingSnapshot imutável |
| 15 | [Permissões e Governança](./15-Sistema-de-Permissões,-Governança-e-Reputação.md) | 6 papéis, reputação, Círculos de Confiança, moderação |
| 16 | [Design System](./16-Design-System-do-FishGuide.md) | Paleta, tipografia, componentes, dark mode, Radar de Pesca |
| 17 | [FG Score — Algoritmo](./17-FG-Score-Engine-Algoritmo-Inteligente-de-Recomendação.md) | Pesos, normalização, confiança, simulação por espécie/local |
| 18 | [Arquitetura de IA](./18-Arquitetura-de-Inteligência-Artificial-do-FishGuide.md) | Assistente, reconhecimento, aprendizado por fases, Digital Twin |
| 19 | [Fontes de Dados e Integrações](./19-Arquitetura-de-Integrações-e-Fontes-de-Dados.md) | Data Lake, multi-provedor, cache inteligente, IoT futuro |
| 20 | [Roadmap de Desenvolvimento](./20-Roadmap-de-Desenvolvimento.md) | Fases por dependência, MVP critérios, Ciclo Inteligente da Pesca |
| 21 | [Modelo de Negócio](./21-Modelo-de-Negócio-e-Estratégia-de-Monetização.md) | Freemium, Premium, Pro, Marketplace, API, Ecossistema |
| 22 | [Segurança e LGPD](./22-Segurança,-Privacidade-e-Conformidade-(LGPD).md) | Classificação de dados, Cofre Digital, consentimento, criptografia |
| 23 | [DevOps e Infraestrutura](./23-Arquitetura-DevOps-e-Infraestrutura.md) | Docker, 4 ambientes, CI/CD, monitoramento, backup |
| 24 | [Estratégia de Testes](./24-Estratégia-de-Testes-e-Garantia-da-Qualidade.md) | Pirâmide de testes, cenários FG Score, Campeonato de Algoritmos |
| 25 | [Manual da API](./25-Manual-da-API-(OpenAPI).md) | Convenções REST, respostas, erros, rate limit, upload, webhooks |
| 26 | [Modelo de Dados Definitivo](./26-Modelo-de-Dados-Definitivo.md) | Todas as tabelas e campos consolidados |
| 27 | [Arquitetura Front-end](./27-Arquitetura-Front-end.md) | Server/Client Components, PWA, Field Mode, Captain Mode |
| 28 | [Arquitetura Back-end](./28-Arquitetura-Back-end-FishGuide.md) | Camadas Domain/Application/Infrastructure/Presentation |
| 29 | [Plano de Evolução 5 Anos](./29-Plano-de-Evolução-de-5-Anos.md) | Foundation → AI → Ecosystem → Global, Memória Coletiva |
| 30 | [Manifesto FishGuide](./30-Manifesto-FishGuide.md) | Propósito, missão, visão, 5 pilares, promessa da marca |

---

## Sobre esta documentação

- **Autor:** Diego Passos
- **Data dos originais:** Julho de 2026
- **Versão:** 1.0
- **Total:** 31 documentos
- **Conversão:** `.docx` → `.md` via script automatizado
