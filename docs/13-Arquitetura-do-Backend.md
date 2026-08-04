# Arquitetura do Backend

- **Projeto:** FishGuide
- **Versão:** 1.0
- **Domínio:** Application
- **Status:** Approved
- **Proprietário:** Diego Passos
- **Última revisão:** 2026-08-03

## 1. Objetivo

Definir a organização do backend, seus módulos, responsabilidades, padrões de desenvolvimento e comunicação interna.

O backend será responsável por:

- regras de negócio; 
- autenticação; 
- integrações externas; 
- processamento de dados; 
- cálculo do Índice FishGuide; 
- armazenamento; 
- comunicação com o frontend. 

## 2. Tecnologias

**Framework**

NestJS 

**Linguagem**

TypeScript 

**ORM**

Prisma ORM 

**Banco**

PostgreSQL + PostGIS 

**Cache**

Redis 

**Filas**

BullMQ 

**Documentação**

Swagger/OpenAPI 

**Autenticação**

JWT 

Passport 

**Testes**

Jest 

## 3. Estrutura do Projeto

- backend/

- src/

- common/

- config/

- database/

- modules/

- jobs/

- integrations/

- storage/

- events/

- main.ts

## 4. Organização dos Módulos

Cada domínio possuirá seu próprio módulo.

- modules/

- auth

- users

- today

- weather

- tides

- astronomy

- spots

- species

- trips

- catches

- equipment

- community

- chat

- notifications

- events

- analytics

- ai

- admin

Cada módulo será completamente independente.

## 5. Estrutura de um Módulo

Exemplo: **Today**

- today/

- controllers/

- services/

- repositories/

- dto/

- entities/

- mappers/

- validators/

- events/

- jobs/

- tests/

- today.module.ts

Assim, tudo relacionado ao módulo permanecerá no mesmo lugar.

## 6. Fluxo de uma Requisição

Frontend
↓
Controller
↓
DTO
↓
ValidationPipe
↓
Service
↓
Repository
↓
Prisma
↓
PostgreSQL

As regras de negócio nunca ficarão no Controller.

## 7. Responsabilidade de Cada Camada

**Controller**

Responsável apenas por:

- receber requisições; 
- validar entrada; 
- chamar o Service; 
- retornar resposta. 

Nunca conterá regras de negócio.

**Service**

É onde ficará toda a inteligência do módulo.

Exemplo:

- TodayService

Responsável por:

- buscar dados; 
- calcular recomendações; 
- montar a tela HOJE. 

**Repository**

Responsável exclusivamente pelo acesso ao banco.

Nunca conterá regras de negócio.

**DTO**

Validação de entrada.

Utilizaremos:

- class-validator 
- class-transformer 

## 8. Módulo "Today"

Este será provavelmente o módulo mais importante do sistema.

Ele será responsável por montar toda a tela principal.

Fluxo:

- TodayController
↓
TodayService
↓
WeatherService
↓
TideService
↓
AstronomyService
↓
FishingEngine
↓
SpotService
↓
RecommendationService
↓
TodayResponse

Perceba que o módulo **Today** funciona como um orquestrador.

Ele não recalcula tudo sozinho; apenas reúne informações dos demais módulos.

## 9. Eventos Internos

O FishGuide utilizará eventos internos para desacoplar funcionalidades.

Exemplos:

- TripStarted

TripFinished

CatchRegistered

SpotCreated

SpotApproved

WeatherUpdated

TideUpdated

RecommendationGenerated

UserRegistered

Isso permite que outros módulos reajam aos acontecimentos sem criar dependências diretas.

## 10. Jobs

Algumas tarefas serão executadas em segundo plano.

Exemplos:

- sincronizar clima; 
- atualizar marés; 
- recalcular índices; 
- gerar miniaturas; 
- enviar notificações; 
- importar dados de APIs. 

## 11. Integrações

Todas as APIs externas ficarão isoladas.

- integrations/

- weather/

- marine/

- astronomy/

- maps/

- geocoding/

Nenhum módulo chamará APIs externas diretamente.

## 12. Configurações

Todas as configurações serão centralizadas.

- config/

- database.ts

- jwt.ts

- redis.ts

- storage.ts

- weather.ts

- maps.ts

Sem valores fixos no código.

## 13. Tratamento de Erros

Todos os erros seguirão um padrão único.

Exemplo:

- {

  "code": "FG-404",

  "message": "Local de pesca não encontrado.",

  "details": {}

}

Também teremos códigos específicos para integrações externas, validações e regras de negócio.

## 14. Logs

Serão registrados:

- logins; 
- sincronizações; 
- capturas; 
- alterações administrativas; 
- erros; 
- consumo de APIs. 

## 15. Auditoria

Toda alteração crítica será auditada.

Exemplos:

- edição de espécie; 
- alteração de pesqueiro; 
- aprovação de conteúdo; 
- mudanças de permissões. 

## 16. Módulo de Recomendações

Um módulo exclusivo para gerar recomendações.

Fluxo:

- Weather

+

Tide

+

Moon

+

Pressure

+

Species

+

History
↓
Recommendation Engine

Esse módulo será reutilizado pela Tela HOJE, Diário e Planejamento.

## 17. Módulo Analytics

Responsável por gerar estatísticas.

Exemplos:

- espécies mais capturadas; 
- locais mais visitados; 
- horários mais produtivos; 
- evolução do usuário; 
- tendências da comunidade. 

## 18. Módulo AI

Inicialmente baseado em regras.

Posteriormente poderá utilizar modelos de Machine Learning.

Responsabilidades:

- gerar previsões; 
- sugerir locais; 
- explicar recomendações; 
- calcular nível de confiança. 

## 19. Comunicação entre Módulos

Evitaremos dependências circulares.

Exemplo:

- Today
↓
Recommendation
↓
Weather
↓
Repository

Um módulo nunca deverá acessar diretamente o banco de outro módulo.

Toda comunicação ocorrerá por serviços públicos ou eventos internos.

## 20. Segurança

Implementaremos:

- JWT; 
- Refresh Token; 
- Rate Limit; 
- Helmet; 
- CORS; 
- Sanitização de entrada; 
- Soft Delete; 
- Auditoria. 

## 21. Testes

Cada módulo terá:

- testes unitários; 
- testes de integração; 
- testes de contratos da API. 

## 22. Estratégia para o Motor Inteligente

Na documentação anterior criamos o **Motor Inteligente de Pesca**. Aqui proponho uma organização mais clara.

Em vez de um único serviço gigantesco, ele será dividido em motores especializados:

- FishingEngine
├── TideEngine
├── WeatherEngine
├── MoonEngine
├── SpeciesEngine
├── CommunityEngine
├── PersonalHistoryEngine
├── ConfidenceEngine
└── RecommendationEngine
Cada motor terá uma responsabilidade bem definida. O FishingEngine apenas coordenará o processo e combinará os resultados.

## 23. Orquestrador da Tela HOJE

Uma ideia que considero essencial é criar um **TodayBuilder**.

Ele será responsável apenas por montar a resposta da tela principal.

Fluxo:

- TodayBuilder
↓
Fishing Score
↓
Missão do Dia
↓
Cards
↓
Alertas
↓
Resumo
↓
Resposta Final

Isso evita que o TodayService cresça demais e facilita a inclusão de novos cards futuramente.

## 24. Feature Flags

Desde o início, o backend suportará **Feature Flags**.

Exemplos:

- habilitar Comunidade; 
- liberar Modo "Estou Pescando"; 
- ativar IA experimental; 
- testar um novo algoritmo do Índice FishGuide. 

Assim poderemos lançar funcionalidades gradualmente e testar com grupos específicos de usuários.

## 25. O conceito que pode se tornar a "assinatura" do FishGuide

Gostaria de propor um componente chamado **Decision Engine**.

Hoje pensamos no FishGuide como um sistema que calcula um índice.

Eu iria além.

O Decision Engine receberá todos os dados disponíveis e responderá perguntas reais do pescador.

Exemplos:

- Vale a pena sair agora? 

Qual o melhor local dentro de 20 km? 

Vale esperar a próxima maré? 

Qual espécie oferece maior chance de captura hoje? 

Qual equipamento costuma funcionar melhor em condições semelhantes? 

O tempo restante até a mudança do vento justifica continuar pescando? 

Na prática, todo o restante do sistema (Tela HOJE, Missão de Pesca, Assistente FishGuide e futuras funcionalidades de IA) consultará esse componente.

Isso significa que o **FishGuide deixa de ser um agregador de informações e passa a ser um sistema de apoio à decisão**, algo que considero um dos maiores diferenciais competitivos do projeto.