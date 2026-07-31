# Relatório — Tela Mapa (como deve ser feita)

Relatório consolidado a partir dos documentos do FishGuide, descrevendo como a tela de **Mapa** deve ser implementada. Fontes: docs 00, 02, 03, 06, 07, 08, 11, 12, 15, 20, 21, 25, 26, 27.

---

## 1. Objetivo da tela

- O mapa **ocupará praticamente toda a tela** (doc 06, seção 7).
- O doc 08 (seção 6) define o Mapa como **"praticamente outro sistema"**: permitirá Pesqueiros, Eventos, Amigos, Marinas, Rampas, Lojas, Rotas, Clima e Marés — tudo **em tempo real**.

## 2. Requisitos funcionais (doc 02 — Módulo Mapa)

| ID | Requisito |
|---|---|
| **RF-020** | Exibir **mapa interativo** |
| **RF-021** | Mostrar **localização atual** |
| **RF-022** | Mostrar **locais cadastrados** |
| **RF-023** | Permitir **pesquisar locais** |
| **RF-024** | Permitir **filtrar por tipo de água**: Praia, Rio, Mangue, Costão, Represa, Mar aberto, Estuário, Canal |
| **RF-025** | **Traçar rota** até o local escolhido |

## 3. Componentes da tela (doc 06, seção 7)

1. **Busca** (pesquisa de locais)
2. **Filtros**
3. **Minha localização**
4. **Pesqueiros**
5. **Eventos**
6. **Amigos**
7. **Rotas**

O doc 08 acrescenta: **Marinas**, **Rampas**, **Lojas**, além de sobreposição de **Clima** e **Marés**.

## 4. Tecnologia (docs 01, 05, 12, 27)

- **Leaflet** é a biblioteca de mapas definida; **MapLibre GL JS** como alternativa se precisarmos de mapas mais avançados (doc 01).
- A tela de mapa é um **Client Component** (interação e mapas) — doc 27, seção 7.
- **Serviço de Mapas** (doc 07, seção 8) — responsabilidades:
  - Exibir mapas
  - **Localizar o usuário**
  - **Calcular rotas**
  - **Pesquisar endereços**
  - **Buscar locais de pesca próximos**
- **Geocodificação** (doc 07, seção 9): converter endereço ↔ coordenadas; usada no cadastro de pesqueiros e exibição de localidades.

## 5. API necessária (docs 11 e 25)

**Mapa (doc 11, seção 12):**

- `GET /map/nearby` — locais próximos
- `GET /map/route` — rota

**Pesqueiros (doc 25):**

- `GET /fishing-spots`
- `GET /fishing-spots/:id`
- `POST /fishing-spots`
- `PATCH /fishing-spots/:id`

## 6. Modelo de dados — FishingSpot (doc 26, seção 6)

Campos: `id`, `name`, `description`, `latitude`, `longitude`, `waterType`, `accessType`, `difficulty`, `visibility`, `createdBy`, `status`.

Relacionamentos: Espécies, Avaliações, Condições, Histórico, Fotos.

## 7. Regras de negócio e privacidade

- **Lei dos Pesqueiros** (doc 00, seção 7): a localização de um **pesqueiro privado nunca deve ser exposta automaticamente**; respeitar propriedade intelectual, privacidade e escolha do usuário.
- **Visibilidade de locais** (doc 15, seção 6): cada local pode ser **Público**, **Compartilhado com amigos**, **Privado** ou **Aproximado** (mostra apenas a região, sem coordenadas exatas) — protege locais tradicionais.
- Novo pesqueiro sugerido passa por aprovação (doc 15).

## 8. UX e fluxos

**Caso de uso — Consultar Pesqueiro (UC-011, doc 03):**

Pesquisar local → Abrir mapa → Visualizar: espécies, fotos, estrutura, avaliações, **rota**, **previsão**, **maré**.

**Navegação (doc 12, seção 8):** rota `/map` entre Hoje (`/today`) e Diário (`/trips`).

**Estados da interface (doc 06, seção 12):** a tela deve prever **Carregando, Sem dados, Erro, Offline, Sucesso**.

**Mapa adaptativo (doc 12, seção 26):** a ordem dos itens se adapta ao pescador — para alguns, o Mapa é o item principal (★).

**Modo "Saindo para Pescar" (doc 12, seção 27):** ao iniciar missão, a interface simplifica e destaca **mapa com a posição atual**, maré em tempo real, clima/vento e botão Registrar Captura.

## 9. Monetização (doc 21)

- Gratuito: mapa com **pesqueiros públicos**.
- **Premium: mapas offline.**

## 10. Roadmap (doc 20)

Fase inicial do **Mapa**: Pesqueiros, Favoritos, Localização.

## 11. Estado atual vs. documentação

**Implementado (branch `feature/map-screen`, mock):**

- Rota `/mapa` com mapa ocupando a tela toda.
- Busca, filtros, "minha localização", locais próximos (mock).
- Marcadores por categoria: Pesqueiro, Evento, Amigo, Rampa, Marina, Loja.
- Mapa estilizado em SVG (placeholder — docs pedem Leaflet).

**Divergências em relação aos docs:**

| Docs | Implementado (mock) |
|---|---|
| Leaflet / MapLibre GL JS | SVG ilustrado (placeholder) |
| Filtro por **tipo de água** (RF-024): Praia, Rio, Mangue, Costão, Represa, Mar aberto, Estuário, Canal | Filtro por **categoria** (pesqueiro, evento, amigo, rampa, marina, loja) |
| **Rotas** (RF-025, `GET /map/route`) | Botão "Ver rota" sem funcionalidade |
| **Localização atual real** (RF-021) | Localização simulada no centro |
| **Pesqueiros reais** (`GET /fishing-spots`, `GET /map/nearby`) | Dados mock locais |
| **Clima e Marés** no mapa (tempo real) | Não presente |
| **Estados**: carregando, sem dados, erro, offline | Não implementados |
| **Visibilidade** de pesqueiros (público/privado/aproximado) | Não aplicada |

## 12. Próximos passos recomendados

1. **Migrar para Leaflet** (fase de dados reais) — manter os componentes de busca/filtros/marcadores/locais próximos já criados, trocando apenas o `MapCanvas`.
2. Criar os **endpoints** `GET /map/nearby` e `GET /map/route` no backend.
3. Modelar **FishingSpot** no Prisma conforme doc 26 e expor CRUD (`/fishing-spots`).
4. Implementar filtro por **tipo de água** (RF-024).
5. Implementar **traçado de rota** (RF-025).
6. Aplicar **visibilidade/privacidade** dos pesqueiros (Lei dos Pesqueiros + doc 15).
7. Prever os **estados** carregando/sem dados/erro/offline.
8. Sobrepõe **clima/marés** nos marcadores (tempo real).
