# Modelagem do Banco de Dados

- **Projeto:** FishGuide
- **Versão:** 1.0
- **Domínio:** Data
- **Status:** Approved
- **Proprietário:** Diego Passos
- **Última revisão:** 2026-08-03

## Objetivo

Definir todas as entidades responsáveis por armazenar as informações do sistema.

**Banco de Dados**

**PostgreSQL 16**

Extensões:

- PostGIS 

UUID 

- pgcrypto 

**Padrões**

Todas as tabelas possuirão:

- id (UUID)

- created_at

- updated_at

- deleted_at (Soft Delete)

Isso facilitará auditoria e recuperação de registros.

**DOMÍNIO 1**

**Usuários**

**Tabela Users**

Campos

- id

- name

- email

- password_hash

- phone

- birth_date

- avatar

- bio

- city

- state

- country

- preferred_language

- privacy

- verified

- status

- last_login

- created_at

- updated_at

- deleted_at

**Tabela User_Settings**

Preferências.

- user_id

- temperature_unit

- distance_unit

- theme

- notifications

- default_map

- location_precision

- favorite_species

- favorite_modality

**Tabela Friends**

Relacionamento entre usuários.

- id

- requester_id

- receiver_id

- status

- accepted_at

**DOMÍNIO 2**

**Locais**

Tabela Fishing_Spots

- id

- name

- slug

- description

- latitude

- longitude

- location (PostGIS)

- city

- state

- country

- access_type

- environment

- depth

- difficulty

- structure

- parking

- boat_ramp

- toilet

- restaurant

- lighting

- is_verified

Tabela Spot_Photos

- id

- spot_id

- image_url

- caption

- uploaded_by

Tabela Spot_Ratings

- id

- spot_id

- user_id

- rating

- security

- access

- cleanliness

- fish_quantity

- comments

**DOMÍNIO 3**

**Espécies**

Tabela Species

- id

- popular_name

- scientific_name

- family

- description

- habitat

- minimum_size

- maximum_size

- average_weight

- best_season

- feeding

- photo

Tabela Species_Baits

- species_id

- bait_id

- score

Tabela Species_Spots

Relacionamento N:N

**DOMÍNIO 4**

**Iscas**

Tabela Baits

- id

- name

- type

- manufacturer

- color

- weight

- length

- floating

- description

**DOMÍNIO 5**

**Equipamentos**

Tabela Equipment

- id

- user_id

- type

- brand

- model

- line

- reel

- rod

- power

- action

- notes

**DOMÍNIO 6**

**Diário**

Tabela Fishing_Trips

Representa a saída de pesca.

- id

- user_id

- spot_id

- started_at

- finished_at

- weather_score

- fishing_score

- notes

Uma saída pode ter várias capturas.

Tabela Catches

- id

- trip_id

- species_id

- weight

- length

- bait_id

- equipment_id

- released

- photo

- observation

Tabela Catch_Photos

Fotos adicionais.

**DOMÍNIO 7**

**Clima**

Tabela Weather

- id

- spot_id

- temperature

- pressure

- humidity

- wind_speed

- wind_direction

- clouds

- rain

- visibility

- uv_index

- weather_code

- collected_at

**DOMÍNIO 8**

**Marés**

Tabela Tide

- id

- spot_id

- date

- high_tide

- low_tide

- height

- coefficient

**DOMÍNIO 9**

**Astronomia**

Tabela Astronomy

- id

- date

- moon_phase

- moonrise

- moonset

- sunrise

- sunset

- illumination

**DOMÍNIO 10**

**Comunidade**

Tabela Posts

- id

- user_id

- trip_id

- title

- content

- visibility

- likes

- comments

- shares

Tabela Comments

- id

- post_id

- user_id

- message

Tabela Likes

- id

- post_id

- user_id

Tabela Reports

Denúncias.

**DOMÍNIO 11**

**Eventos**

Tabela Events

- id

- title

- spot_id

- date

- vacancies

- description

- organizer_id

**DOMÍNIO 12**

**Chat**

Tabela Conversations

Tabela Messages

Tabela Attachments

**DOMÍNIO 13**

**Notificações**

Tabela Notifications

- id

- user_id

- title

- message

- read

- created_at

**DOMÍNIO 14**

**IA**

Tabela Fishing_Index

- id

- trip_id

- score

- pressure_score

- moon_score

- tide_score

- weather_score

- wind_score

- explanation

Tabela AI_Recommendations

- id

- user_id

- recommendation

- confidence

- generated_at

**Relacionamentos principais**

Usuário
   │
   ├── Diário
   │      │
   │      ├── Capturas
   │      │       │
   │      │       ├── Espécie
   │      │       ├── Isca
   │      │       └── Equipamento
   │      │
   │      └── Índice de Pesca
   │
   ├── Posts
   │      ├── Comentários
   │      └── Curtidas
   │
   ├── Eventos
   │
   └── Amigos
Local
   ├── Clima
   ├── Marés
   ├── Espécies
   ├── Avaliações
   └── Eventos
**Melhorias que eu incluiria**

Aqui é onde eu gostaria de elevar o nível do projeto.

## 1. Histórico de APIs

Nunca sobrescrever os dados recebidos das APIs.

Guardar o histórico.

Assim conseguimos responder:

- Como estava o tempo no dia em que peguei aquele robalo?

Isso também permitirá treinar modelos de IA futuramente.

## 2. Histórico do Índice de Pesca

Guardar todos os índices calculados.

Depois poderemos gerar gráficos.

## 3. Banco Geográfico

Usaremos **PostGIS**.

Assim poderemos responder perguntas como:

- Quais pesqueiros existem em um raio de 15 km?

Isso será extremamente rápido.

## 4. Sistema de Tags

Em vez de criar dezenas de colunas, utilizar uma tabela de tags para classificar locais e espécies.

Exemplos:

- Ideal para caiaque 

Acesso por barco 

Pesca noturna 

Familiar 

Água doce 

Água salgada 

Fly fishing 

Surf casting 

## 5. Versionamento de Dados

Alguns dados mudam com o tempo, como descrições de espécies ou informações de um pesqueiro. Podemos manter um histórico de alterações importantes para auditoria e confiabilidade.

## 6. Sistema de Contribuições

Em vez de permitir que qualquer usuário altere diretamente informações oficiais, criaremos um fluxo de contribuições:

- O usuário sugere uma alteração. 

A sugestão fica pendente. 

Moderadores analisam. 

Após aprovação, a alteração é publicada. 

Assim garantimos qualidade sem perder a colaboração da comunidade.