# Visão Geral do Projeto

**FishGuide**

**Sistema Inteligente de Planejamento de Pescarias**

- **Versão:** 1.0
- **Autor:** Diego Passos

## 1. Introdução

O FishGuide é uma plataforma web desenvolvida para centralizar todas as informações relevantes para pescadores esportivos, recreativos e profissionais.

Atualmente, um pescador precisa consultar diversos aplicativos e sites para obter informações sobre:

- previsão do tempo; 
- tábua de marés; 
- fase da lua; 
- nascer e pôr do sol; 
- nascer e pôr da lua; 
- velocidade do vento; 
- pressão atmosférica; 
- locais para pesca; 
- espécies de peixes. 

O objetivo do FishGuide é reunir todas essas informações em uma única plataforma moderna, intuitiva e inteligente.

Além disso, o sistema irá analisar automaticamente todas essas variáveis para indicar a qualidade da pescaria naquele momento, ajudando o usuário a escolher o melhor horário e o melhor local para pescar.

## 2. Objetivos

## Objetivo Geral

Construir uma plataforma inteligente que auxilie pescadores no planejamento de pescarias através da análise automática de dados meteorológicos, oceanográficos, astronômicos e históricos de captura.

## Objetivos Específicos

Centralizar informações.

Reduzir o tempo gasto pesquisando vários aplicativos.

Apresentar uma previsão de pesca baseada em inteligência.

Permitir registrar todas as pescarias realizadas.

Criar estatísticas pessoais.

Cadastrar pontos de pesca.

Cadastrar espécies.

Cadastrar iscas.

Criar uma comunidade de pescadores.

Preparar o sistema para Inteligência Artificial.

## 3. Público-alvo

O sistema foi pensado para atender diversos perfis.

**Pescador Esportivo**

Procura robalo, xaréu, tarpon, pescada, etc.

Deseja saber:

- melhor maré 
- melhor lua 
- vento 
- pressão 

**Pescador Profissional**

Busca produtividade.

Precisa acompanhar:

- marés 
- previsão 
- ventos 
- segurança 

**Guias de Pesca**

Necessitam organizar clientes.

Planejar saídas.

Consultar previsão.

**Clubes de Pesca**

Organização de eventos.

Competições.

Ranking.

**Lojas de Pesca (futuro)**

Divulgação.

Promoções.

Eventos.

## 4. Problema

Hoje as informações estão espalhadas.

Um pescador normalmente consulta:

- Windy 

Climatempo 

Tábua de Marés 

Google Maps 

Aplicativos de Lua 

Facebook 

WhatsApp 

Cada aplicativo fornece apenas parte das informações.

O FishGuide reunirá tudo em um único ambiente.

## 5. Solução

O sistema irá integrar diversos serviços e apresentar uma única tela com:

- Condições climáticas. 

Marés. 

Lua. 

Sol. 

Pressão. 

Vento. 

Índice Inteligente de Pesca. 

Locais próximos. 

Espécies encontradas. 

Diário de pescarias. 

Histórico. 

## 6. Diferenciais

Não será apenas um aplicativo de previsão do tempo.

Será um sistema especialista em pesca.

Alguns diferenciais:

- Índice Inteligente de Pesca.

Histórico pessoal.

Estatísticas.

Mapa dos pesqueiros.

Cadastro de espécies.

Cadastro de iscas.

Ranking.

Comunidade.

IA para recomendações.

Alertas personalizados.

PWA.

Funcionar em celular.

Funcionar em computador.

API própria.

## 7. Missão

Facilitar o planejamento das pescarias através da tecnologia.

## 8. Visão

Ser a principal plataforma brasileira para planejamento de pescarias.

## 9. Valores

Confiabilidade.

Precisão.

Facilidade de uso.

Inovação.

Colaboração.

Respeito ao meio ambiente.

Incentivo à pesca consciente.

## 10. Escopo Inicial (MVP)

O MVP deve resolver o principal problema do usuário: saber **quando**, **onde** e **como** pescar.

Funcionalidades iniciais:

- Cadastro e login. 

Dashboard principal. 

Geolocalização do usuário. 

Previsão do tempo. 

Tábua de marés. 

Fase da lua. 

Nascer e pôr do sol. 

Nascer e pôr da lua. 

Pressão atmosférica. 

Índice Inteligente de Pesca. 

Cadastro de locais de pesca. 

Cadastro de espécies. 

Diário de pescarias. 

Favoritos. 

## 11. Futuras Versões

- **Versão:** 2.0

Comunidade.

Comentários.

Avaliações.

Fotos.

Ranking.

Eventos.

- **Versão:** 3.0

Inteligência Artificial.

Reconhecimento de peixes por foto.

Sugestão automática de iscas.

Recomendação personalizada.

Análise do histórico.

- **Versão:** 4.0

Aplicativo Android.

Aplicativo iPhone.

Integração com relógios esportivos.

Modo offline completo.

## 12. Arquitetura Tecnológica

**Front-end**

Next.js 

React 

TypeScript 

Tailwind CSS 

- shadcn/ui 

React Query 

React Hook Form 

Zod 

Leaflet (ou MapLibre GL JS, se quisermos mapas mais avançados) 

**Backend**

NestJS 

Prisma ORM 

PostgreSQL 

Redis 

BullMQ 

Swagger/OpenAPI 

JWT + Refresh Token 

**Infraestrutura**

Docker 

Docker Compose 

GitHub 

GitHub Actions (CI/CD) 

Vercel (frontend) 

Railway, Render ou VPS (backend) 

## 13. Objetivo de Longo Prazo

O FishGuide será uma plataforma completa para pescadores, oferecendo não apenas previsões, mas também inteligência baseada em dados, histórico pessoal e uma comunidade colaborativa.