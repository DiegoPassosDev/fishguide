# Arquitetura Back-end FishGuide

- **Projeto:** FishGuide
- **Versão:** 1.0

## 1. Objetivo

Definir a arquitetura interna do backend do FishGuide, garantindo:

- organização; 
- escalabilidade; 
- manutenção simples; 
- separação de responsabilidades; 
- evolução segura. 

## 2. Stack Oficial

**Framework**

NestJS

Motivos:

- arquitetura modular; 
- suporte nativo a TypeScript; 
- excelente organização; 
- injeção de dependência; 
- grande comunidade. 

**Linguagem**

TypeScript

**ORM**

Prisma ORM

Responsável por:

- acesso ao banco; 
- migrations; 
- tipagem automática; 
- segurança nas queries. 

**Banco**

PostgreSQL

**Cache e Filas**

Redis + BullMQ

## 3. Arquitetura Geral

O backend seguirá uma arquitetura baseada em camadas.

                    API
                     │
              Controllers
                     │
              Application Layer
                     │
              Domain Layer
                     │
          Infrastructure Layer
                     │
        Database / External APIs

## 4. Estrutura de Pastas

Proposta:

- src/
├── modules/
│
├── common/
│
├── config/
│
├── database/
│
├── integrations/
│
├── jobs/
│
├── events/
│
├── guards/
│
├── interceptors/
│
└── main.ts

## 5. Organização por Módulos

Cada domínio terá seu próprio módulo.

Exemplo:

- modules/
├── auth
├── users
├── fishing
├── spots
├── species
├── weather
├── tides
├── astronomy
├── fg-score
├── community
├── notifications
└── ai

## 6. Estrutura Interna de um Módulo

Exemplo:

- fg-score/
├── domain/
│   ├── entities
│   ├── rules
│   └── calculations
├── application/
│   ├── services
│   └── use-cases
├── infrastructure/
│   ├── repositories
│   └── adapters
└── presentation/
    ├── controllers
    └── dto

## 7. Domain Layer

Aqui ficam as regras mais importantes.

Exemplos:

- cálculo do FG Score; 
- regras de recomendação; 
- validações de pescaria; 
- regras ambientais. 

O domínio não conhece:

- banco; 
- APIs; 
- frontend. 

Ele apenas conhece regras.

## 8. Application Layer

Responsável pelos casos de uso.

Exemplos:

- Criar Pescaria

Registrar Captura

Calcular Recomendação

Gerar Missão

Atualizar Memória Coletiva

## 9. Infrastructure Layer

Responsável pela comunicação externa.

Exemplos:

- Prisma; 
- APIs meteorológicas; 
- mapas; 
- armazenamento de imagens; 
- serviços de e-mail. 

## 10. Controllers

Responsáveis apenas por:

- receber requisição; 
- validar entrada; 
- chamar caso de uso; 
- retornar resposta. 

Não devem possuir regra de negócio.

## 11. Módulos Principais

**Auth Module**

Responsável por:

- login; 
- cadastro; 
- JWT; 
- refresh token; 
- recuperação de senha. 

**Users Module**

Responsável por:

- perfil; 
- preferências; 
- estatísticas; 
- privacidade. 

**Fishing Module**

O coração da experiência.

Responsável por:

- pescarias; 
- capturas; 
- timeline; 
- DNA da pescaria. 

**Spots Module**

Responsável por:

- pesqueiros; 
- localização; 
- espécies; 
- histórico. 

**Environmental Module**

Responsável por:

- clima; 
- maré; 
- lua; 
- sol; 
- pressão. 

**FG Score Module**

O cérebro inicial.

Responsável por:

- cálculo; 
- pesos; 
- confiança; 
- explicação. 

**Community Module**

Responsável por:

- posts; 
- comentários; 
- avaliações; 
- reputação. 

**AI Module**

Futuro.

Responsável por:

- assistente; 
- análise; 
- previsões; 
- recomendações avançadas. 

## 12. Comunicação entre módulos

Preferência:

- **Comunicação direta**

Quando a resposta precisa ser imediata.

Exemplo:

- Usuário abre Tela HOJE.

**Eventos**

Quando pode ser assíncrono.

Exemplo:

- Nova captura registrada.

Evento:

- FishingTripCreated

Consumidores:

- Atualizar estatística

Atualizar DNA

Atualizar Memória Coletiva

Recalcular confiança

## 13. Event Bus

Inicialmente:

- Redis Pub/Sub ou BullMQ.

Futuro:

- RabbitMQ ou Kafka.

## 14. Jobs Assíncronos

Processos em segundo plano:

- sincronização de clima; 
- cálculo de FG Score; 
- processamento de imagens; 
- notificações; 
- relatórios. 

## 15. FG Score Engine

Será isolado como um domínio próprio.

Fluxo:

- Dados ambientais

+

Histórico

+

Espécie

+

Local

+

Comportamento
↓
FG Score Engine
↓
Nota
↓
Confiança
↓
Explicação

## 16. Decision Engine

Camada superior ao FG Score.

Exemplo:

- FG Score:
- 87

Decision Engine:

- "Saia entre 05:40 e 07:20.

Priorize margem de pedra.

Use camarão vivo.

Chance maior para robalo."

## 17. Integrações Externas

Cada integração terá um Adapter.

Exemplo:

- weather/
├── weather.interface.ts
├── openweather.adapter.ts
└── weather.service.ts
Se trocar fornecedor:

- A regra de negócio não muda.

## 18. Tratamento de Erros

Padrão:

- erros conhecidos; 
- mensagens amigáveis; 
- logs técnicos; 
- rastreamento. 

## 19. Segurança

Backend será responsável por:

- validar permissões; 
- proteger localização; 
- controlar acesso; 
- validar uploads; 
- limitar requisições. 

## 20. Observabilidade

Cada módulo terá:

- logs; 
- métricas; 
- health check. 

## 21. Minha sugestão mais importante

**Backend orientado ao conhecimento**

A maioria dos sistemas é orientada a transações.

Exemplo:

- "Usuário criou uma pescaria."

Mas o FishGuide deve pensar:

- "Uma nova informação sobre o mundo da pesca foi criada."

Essa mudança muda a arquitetura.

Cada ação importante gera conhecimento.

Exemplo:

- Captura registrada
↓
Conhecimento gerado:

- - espécie encontrada
- - horário produtivo
- - condição ambiental
- - estratégia utilizada

## 22. A ideia que considero revolucionária

**FishGuide Intelligence Core**

Eu criaria um módulo central chamado:

- intelligence-core

Ele não seria uma IA.

Seria a camada que conecta:

- FG Score; 
- Decision Engine; 
- Memória Coletiva; 
- DNA da Pescaria; 
- Knowledge Graph. 

Ele seria o "cérebro" evolutivo do FishGuide.

No começo:

- Regras matemáticas.

Depois:

- Machine Learning.

Depois:

- IA generativa.

Mas a base permanece a mesma.

## 23. Minha maior ideia deste documento

**Sistema de Explicabilidade Obrigatória**

Toda recomendação do FishGuide deverá carregar sua justificativa.

Nunca:

- "Pesque hoje, nota 92."

Sempre:

- "Nota 92 porque:
- maré favorável (+18) 
- lua adequada (+12) 
- pressão estável (+15) 
- histórico do local positivo (+25) 
- vento adequado (+10) 
- dados históricos suficientes (+12)" 

Isso gera confiança.

O usuário entende o sistema.

Ele aprende junto.