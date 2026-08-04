# Modelo de Dados Definitivo

- **Projeto:** FishGuide
- **Versão:** 1.0
- **Domínio:** Data
- **Status:** Approved
- **Proprietário:** Diego Passos
- **Última revisão:** 2026-08-03

## 1. Objetivo

Definir toda a estrutura lógica do banco de dados do FishGuide.

O modelo deverá ser:

- escalável; 
- normalizado; 
- preparado para IA; 
- preparado para análises históricas; 
- compatível com PostgreSQL e Prisma ORM. 

## 2. Princípios

Todo dado deverá possuir:

- identificador único (UUID); 
- datas de criação e atualização; 
- suporte à auditoria quando necessário; 
- integridade referencial; 
- possibilidade de evolução sem quebra de compatibilidade. 

## 3. Domínio: Usuários

**Entidade User**

Campos principais:

- id
- name
- email
- passwordHash
- avatar
- phone
- birthDate
- country
- state
- city
- preferredLanguage
- subscriptionPlan
- status
- emailVerified
- createdAt
- updatedAt
- deletedAt

Relacionamentos:

- Equipamentos 

Pescarias 

Capturas 

Preferências 

Missões 

Conquistas 

Notificações 

Postagens 

Comentários 

**UserPreferences**

Campos:

- measurementSystem
- temperatureUnit
- distanceUnit
- theme
- notificationsEnabled
- defaultFishingStyle
- preferredSpecies
- preferredLocations
- privacyLevel

**UserStatistics**

Campos:

- totalTrips
- totalFish
- totalSpecies
- bestFgScore
- totalHoursFishing
- successRate
- favoriteSpecies
- favoriteSpot

## 4. Domínio: Equipamentos

**Equipment**

Campos:

- id
- userId
- category
- brand
- model
- description
- active

Categorias:

- Vara 

Molinete 

Carretilha 

Linha 

Leader 

Anzol 

Isca Artificial 

Isca Natural 

Acessórios 

## 5. Domínio: Espécies

**Species**

Campos:

- id
- commonName
- scientificName
- family
- habitat
- waterType
- feedingBehavior
- activityPattern
- minimumSize
- maximumSize
- description
- image

Relacionamentos:

- Capturas 

Pesqueiros 

Regras do FG Score 

**SpeciesSeason**

Tabela para sazonalidade.

- speciesId
- month
- probability
- notes

## 6. Domínio: Pesqueiros

**FishingSpot**

Campos:

- id
- name
- description
- latitude
- longitude
- waterType
- accessType
- difficulty
- visibility
- createdBy
- status

Relacionamentos:

- Espécies 

Avaliações 

Condições 

Histórico 

Fotos 

**FishingSpotSpecies**

Relacionamento N:N

- spotId
- speciesId
- occurrenceLevel

**FishingSpotCondition**

Histórico ambiental.

Campos:

- spotId
- date
- waterTemperature
- salinity
- visibility
- current
- notes

## 7. Domínio: Pescarias

**FishingTrip**

Essa será uma das principais tabelas do sistema.

Campos:

- id
- userId
- spotId
- startTime
- endTime
- tripType
- objective
- notes
- fgScore
- confidenceLevel
- weatherSnapshot
- tideSnapshot
- moonSnapshot
- pressureSnapshot

Observe que guardaremos um **snapshot** das condições do momento da pescaria.

Isso garante que análises futuras utilizem exatamente os dados existentes naquele dia, mesmo que a API externa mude posteriormente.

**Catch**

Campos:

- tripId
- speciesId
- quantity
- weight
- length
- bait
- technique
- released
- captureTime
- photo
- notes

## 8. Domínio: Missões

**Mission**

Campos:

- id
- userId
- objective
- speciesId
- spotId
- recommendedTime
- fgScore
- status
- createdAt

**MissionSimulation**

Permite comparar estratégias.

## 9. Domínio: Comunidade

**Post**

Campos:

- id
- authorId
- title
- content
- visibility
- locationType
- createdAt

**Comment**

Relacionamento.

Post → Comentários

**Like**

Relacionamento genérico.

**Report**

Denúncias.

## 10. Domínio: Avaliações

**Review**

Campos:

- spotId
- userId
- rating
- text
- createdAt

## 11. Domínio: FG Score

**FgScoreHistory**

Essa tabela será extremamente importante.

Campos:

- date
- spotId
- speciesId
- score
- confidence
- weatherFactors
- tideFactors
- moonFactors
- pressureFactors

Ela permitirá acompanhar a evolução do algoritmo.

## 12. Domínio: DNA da Pescaria

**FishingDNA**

Campos:

- tripId
- environmentScore
- strategyScore
- equipmentScore
- executionScore
- successScore

Esses índices representarão o "perfil genético" daquela pescaria.

## 13. Domínio: Memória Coletiva

**CommunityKnowledge**

Campos:

- speciesId
- spotId
- season
- averageScore
- confidence
- validatedTrips

Essa tabela não pertence a nenhum usuário.

Ela representa o conhecimento acumulado da plataforma.

## 14. Domínio: Notificações

**Notification**

Campos:

- userId
- title
- message
- type
- read
- createdAt

## 15. Domínio: Auditoria

**AuditLog**

Campos:

- entity
- entityId
- action
- performedBy
- timestamp
- ip
- userAgent

## 16. Domínio: Integrações

**ExternalDataCache**

Armazenará respostas normalizadas das APIs.

Campos:

- provider
- type
- key
- payload
- expiresAt

## 17. Domínio: Atlas Vivo da Pesca

**FishingSpotDigitalTwin**

Cada pesqueiro terá seu "gêmeo digital".

Campos:

- spotId
- environmentIndex
- speciesIndex
- pressureIndex
- historicalIndex
- lastUpdated

## 18. Domínio: Gamificação

**Achievement**

Conquistas.

**Badge**

Distintivos.

**UserBadge**

Relacionamento.

## 19. Índices

Índices importantes:

- latitude/longitude (PostGIS futuramente); 
- data; 
- espécie; 
- usuário; 
- FG Score; 
- local; 
- status. 

Esses índices serão fundamentais para consultas rápidas.

## 20. Estratégia de Exclusão

Utilizaremos **Soft Delete** para entidades importantes.

Exemplos:

- usuários; 
- pescarias; 
- postagens. 

Isso preserva histórico e facilita auditorias.

## 21. Minha sugestão mais importante

**Eventos Ambientais**

Criaria uma tabela específica chamada:

- EnvironmentalEvent

Ela registraria eventos relevantes, como:

- ressaca; 
- cheia; 
- estiagem; 
- chuva intensa; 
- frente fria; 
- mortandade de peixes; 
- floração de algas. 

No futuro, esses eventos poderão influenciar diretamente o FG Score e enriquecer o Atlas Vivo da Pesca.

## 22. A ideia que considero mais inovadora

**Linha do Tempo Ambiental**

Além da linha do tempo da pescaria, cada pesqueiro terá uma linha do tempo própria.

Exemplo:

- Mosqueiro
↓
2019

Grande incidência de robalos
↓
2020

Obras na região
↓
2021

Queda da salinidade
↓
2022

Recuperação ambiental
↓
2023

Melhora nas capturas
↓
2024

Maior presença de xaréus
↓
2025

Melhor temporada dos últimos anos

Essa linha do tempo poderá combinar:

- dados oficiais; 
- relatos da comunidade; 
- registros das pescarias; 
- eventos ambientais. 

Na prática, o FishGuide começará a contar a **história de cada pesqueiro**, e isso será um enorme diferencial.