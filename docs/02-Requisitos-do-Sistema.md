# Requisitos do Sistema

- **Projeto:** FishGuide
- **Versão:** 1.0

## 1. Objetivo

Este documento define todos os requisitos funcionais, não funcionais e regras de negócio do sistema FishGuide.

Os requisitos servirão como base para:

- Modelagem do banco de dados 

Desenvolvimento do Backend 

Desenvolvimento do Frontend 

Testes 

Evolução do sistema 

## 2. Escopo

O FishGuide será uma plataforma inteligente destinada ao planejamento, registro e compartilhamento de pescarias, integrando dados meteorológicos, oceanográficos, astronômicos e conhecimento colaborativo entre pescadores.

## 3. Classificação dos Requisitos

Utilizaremos o seguinte padrão:

- **RF** → Requisito Funcional 

**RNF** → Requisito Não Funcional 

**RN** → Regra de Negócio 

Exemplo:

- RF-001

RNF-001

RN-001

## 4. Requisitos Funcionais

**Módulo de Usuários**

**RF-001**

O sistema deverá permitir o cadastro de usuários.

**RF-002**

Permitir login utilizando:

- Email 

Google 

(Futuramente Apple e GitHub.)

**RF-003**

Permitir recuperação de senha.

**RF-004**

Editar perfil.

Campos:

- Nome 

Foto 

Cidade 

Estado 

País 

Modalidade de pesca 

Biografia 

**RF-005**

Permitir configurar a privacidade do perfil.

Opções:

- Público 

Apenas Amigos 

Privado 

**Módulo Dashboard**

**RF-006**

Exibir na tela inicial:

- Temperatura 

Cidade 

Pressão 

Vento 

Umidade 

Lua 

Nascer do Sol 

Pôr do Sol 

Próxima maré 

Índice Inteligente de Pesca 

**RF-007**

Exibir gráfico da maré.

**RF-008**

Mostrar melhores horários para pesca.

**RF-009**

Mostrar locais próximos.

**RF-010**

Mostrar espécies comuns na região.

**Módulo Meteorologia**

**RF-011**

Consultar previsão do tempo.

**RF-012**

Exibir:

- Temperatura 

Pressão 

Umidade 

Chuva 

Nebulosidade 

Índice UV 

Direção do vento 

Velocidade do vento 

**RF-013**

Mostrar previsão para sete dias.

**Módulo Marés**

**RF-014**

Consultar tábua de marés.

**RF-015**

Exibir:

- Alta mar 

Baixa mar 

Altura 

Horário 

**RF-016**

Mostrar gráfico diário.

**RF-017**

Mostrar previsão para sete dias.

**Módulo Astronomia**

**RF-018**

Exibir:

- Lua 

Iluminação 

Nascer da Lua 

Pôr da Lua 

**RF-019**

Exibir:

- Nascer do Sol 

Pôr do Sol 

**Módulo Mapa**

**RF-020**

Exibir mapa interativo.

**RF-021**

Mostrar localização atual.

**RF-022**

Mostrar locais cadastrados.

**RF-023**

Permitir pesquisar locais.

**RF-024**

Permitir filtrar por:

- Praia 

Rio 

Mangue 

Costão 

Represa 

Mar aberto 

Estuário 

Canal 

**RF-025**

Traçar rota até o local escolhido.

**Módulo Espécies**

**RF-026**

Cadastrar espécies.

**RF-027**

Exibir:

- Foto 

Nome 

Nome científico 

Peso médio 

Comprimento 

Habitat 

Alimentação 

Melhor época 

Melhor maré 

Melhor lua 

Melhor isca 

**Módulo Locais**

**RF-028**

Cadastrar locais.

**RF-029**

Cadastrar:

- Latitude 

Longitude 

Fotos 

Descrição 

Estrutura 

Acesso 

**RF-030**

Associar espécies ao local.

**RF-031**

Avaliar local.

**Módulo Diário**

**RF-032**

Registrar pescaria.

**RF-033**

Registrar:

- Data 

Hora 

Local 

Espécie 

Peso 

Comprimento 

Foto 

Observações 

**RF-034**

Registrar automaticamente:

- Pressão 

Maré 

Lua 

Temperatura 

Vento 

**RF-035**

Editar registros.

**RF-036**

Excluir registros.

**Módulo Equipamentos**

**RF-037**

Cadastrar equipamentos.

Categorias:

- Vara 

Carretilha 

Molinete 

Linha 

Leader 

Isca 

Anzol 

**RF-038**

Associar equipamento à pescaria.

**Módulo Estatísticas**

**RF-039**

Gerar estatísticas pessoais.

**RF-040**

Mostrar:

- Maior peixe 

Quantidade 

Espécies 

Peso total 

Média por pescaria 

**RF-041**

Gerar gráficos.

**Módulo Índice Inteligente**

**RF-042**

Calcular automaticamente o índice de pesca.

**RF-043**

Classificar:

- Excelente 

Muito Bom 

Bom 

Regular 

Ruim 

**RF-044**

Explicar os fatores que influenciaram o resultado.

Exemplo:

- "Índice alto devido à pressão estável, maré enchente e lua crescente."

**Módulo Comunidade**

**RF-045**

Criar publicações.

**RF-046**

Curtir publicações.

**RF-047**

Comentar publicações.

**RF-048**

Compartilhar publicações.

**RF-049**

Seguir usuários.

**RF-050**

Criar grupos.

**RF-051**

Criar eventos de pesca.

**RF-052**

Enviar mensagens privadas.

**RF-053**

Avaliar locais.

**RF-054**

Publicar dicas.

**RF-055**

Criar enquetes.

**RF-056**

Denunciar conteúdo inadequado.

**RF-057**

Escolher nível de privacidade do ponto de pesca.

Público 

Aproximado 

Apenas Amigos 

Privado 

**Módulo Conquistas**

**RF-058**

Gerar medalhas.

**RF-059**

Gerar ranking.

**Módulo Administração**

**RF-060**

Gerenciar:

- Usuários 

Espécies 

Locais 

Publicações 

Comentários 

Denúncias 

## 5. Requisitos Não Funcionais

**Segurança**

**RNF-001**

Autenticação JWT.

**RNF-002**

Criptografia de senhas.

**RNF-003**

Proteção contra ataques comuns (OWASP Top 10).

**RNF-004**

Controle de permissões por perfil (RBAC).

**Desempenho**

**RNF-005**

Tempo médio de resposta inferior a 500 ms para consultas comuns.

**RNF-006**

Uso de cache (Redis) para dados de APIs externas.

**RNF-007**

Atualização assíncrona de dados por filas (BullMQ).

**Escalabilidade**

**RNF-008**

Arquitetura modular.

**RNF-009**

API REST documentada com OpenAPI/Swagger.

**RNF-010**

Preparação para microsserviços no futuro.

**Usabilidade**

**RNF-011**

Interface responsiva.

**RNF-012**

Compatível com dispositivos móveis e desktops.

**RNF-013**

Acessibilidade seguindo WCAG 2.1 nível AA sempre que possível.

**RNF-014**

Suporte a PWA para instalação em dispositivos.

## 6. Regras de Negócio

**RN-001**

O Índice Inteligente de Pesca deverá considerar múltiplos fatores (maré, lua, pressão, vento, temperatura, chuva e histórico), mas sua fórmula deverá ser configurável para permitir ajustes sem necessidade de alterar o código-fonte.

**RN-002**

Um registro de pescaria poderá ser público, compartilhado apenas com amigos ou privado.

**RN-003**

O usuário poderá ocultar a localização exata das capturas, compartilhando apenas uma área aproximada ou nenhuma informação geográfica.

**RN-004**

As informações coletivas utilizadas para gerar estatísticas e recomendações deverão ser anonimizadas, preservando a privacidade dos usuários.

**RN-005**

Uma espécie poderá estar associada a vários locais, e um local poderá conter várias espécies (relação muitos-para-muitos).

**RN-006**

Os dados de clima, marés e astronomia deverão registrar a data e a hora da consulta, permitindo manter o histórico utilizado em cada pescaria.

**RN-007**

O sistema deverá alertar o usuário sobre períodos de defeso e exibir orientações relacionadas às espécies protegidas, sem impedir o registro histórico de capturas realizadas em conformidade com a legislação.

**RN-008**

Toda publicação poderá ser denunciada. Conteúdos denunciados ficarão disponíveis até análise da moderação, salvo quando houver violação grave das políticas da plataforma.

**Observações de Arquitetura**

Este documento define **o que** o sistema deve fazer, não **como** será implementado. As decisões de arquitetura, banco de dados, APIs, fluxos e componentes serão detalhadas nos próximos documentos.

## 7. Status de Implementação (31/07/2026)

### Requisitos implementados

- **RF-001** — Cadastro de usuários (`POST /auth/register`). ✔
- **RF-002** — Login por email e senha (`POST /auth/login`). Login via Google/Apple é apenas visual, sem ação. ⚠
- **RF-003** — Recuperação de senha (`POST /auth/forgot-password`) — valida se o email é cadastrado; o envio real de email ainda não é feito. ✔ (parcial)
- **RF-004** — Editar perfil (`PATCH /users/me`): nome, cidade, estado, país, telefone e biografia. Foto (avatar) e "Modalidade de pesca" ainda não implementados. ⚠
- **RF-005** — Privacidade do perfil (Público / Amigos / Privado). ✔
- **RF-020** — Exibir mapa interativo (mock estilizado). ✔
- **RF-021** — Mostrar localização atual. ✔
- **RF-022** — Mostrar locais cadastrados (mock). ✔
- **RF-023** — Permitir pesquisar locais. ✔
- **RF-024** — Permitir filtrar por categoria (Praia, Rio, Mangue, Costão, Represa, Mar aberto, Estuário, Canal). ✔
- **RF-032** — Registrar pescaria (`/pescar`): iniciar, registrar capturas e finalizar (mock). ✔
- **RF-033** — Captura com espécie, peso, comprimento, foto e observações. ✔
- **RF-034** — Registro automático de pressão, maré, lua, temperatura e vento (snapshot no início da pescaria, mock). ✔
- **RF-035** — Editar capturas. ✔
- **RF-036** — Excluir capturas. ✔
- **RF-045** — Criar publicações (mock). ✔
- **RF-046** — Curtir publicações. ✔
- **RF-047** — Comentar publicações. ✔
- **RF-048** — Compartilhar publicações. ✔
- **RF-049** — Seguir usuários. ✔

### Funcionalidades adicionadas além desta especificação

- **Alterar senha** (`POST /auth/change-password`) — troca de senha validando a senha atual.
- **Tema claro/escuro** — alternância global persistida no dispositivo (`localStorage`), aplicada também às telas de autenticação.
- **Unidades de medida** — peso (kg/lb) e temperatura (°C/°F).
- **Preferências de notificação** — lembretes de marés e alertas de condições do tempo.
- **Sair da conta** — logout disponível no perfil.
- **Sobre o aplicativo** — versão e descrição exibidas no perfil.
- **"Atualizado há X min"** — indicador de atualização dos dados no cabeçalho da tela HOJE.

### Ainda não implementado

- Módulos: Diário (histórico/timeline), Espécies, Locais, Estatísticas, Equipamentos, Administração e Motor Inteligente. Mapa (`/map`), comunidade (`/community`) e registro de pescaria (`/pescar`) já possuem telas.
- Tela HOJE com dados reais (atualmente utiliza dados mock).
- Tema "automático" (seguir o sistema operacional).
- Backend: troca de senha por link (`reset-password`), `refresh token` e `logout` no servidor.