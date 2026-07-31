# Casos de Uso e Fluxos do Sistema

- **Projeto:** FishGuide
- **Versão:** 1.0

## 1. Objetivo

Este documento descreve os fluxos de utilização do FishGuide, definindo como os usuários interagem com o sistema desde o primeiro acesso até a utilização dos recursos mais avançados.

## 2. Atores do Sistema

**Visitante**

Pessoa que ainda não possui cadastro.

Pode:

- Visualizar página inicial. 

Conhecer o sistema. 

Criar conta. 

Fazer login. 

**Usuário**

Usuário autenticado.

Pode utilizar todos os recursos disponíveis conforme seu perfil.

**Moderador**

Responsável por acompanhar o conteúdo da comunidade.

Pode:

- Remover publicações. 

Ocultar comentários. 

Analisar denúncias. 

Suspender usuários. 

**Administrador**

Possui acesso completo ao sistema.

Pode administrar:

- Usuários. 

Espécies. 

Locais. 

Eventos. 

Publicações. 

Configurações. 

APIs. 

Sistema. 

## 3. Fluxo Geral do Sistema

Visitante
      ↓
Cadastro/Login
      ↓
Dashboard
     │
     ├── Clima
     ├── Marés
     ├── Lua
     ├── Índice de Pesca
     ├── Mapa
     ├── Diário
     ├── Comunidade
     ├── Eventos
     ├── Estatísticas
     └── Perfil

## 4. Caso de Uso – Cadastro

**UC-001**

**Nome**

Cadastrar usuário

## Objetivo

Criar uma conta.

**Ator**

Visitante

**Fluxo Principal**

Acessar cadastro. 

Informar nome. 

Informar e-mail. 

Criar senha. 

Aceitar termos. 

Confirmar e-mail. 

Conta criada. 

**Fluxo Alternativo**

Cadastro utilizando Google.

**Resultado Esperado**

Usuário autenticado.

## 5. Caso de Uso – Login

**UC-002**

**Ator**

Usuário

**Fluxo**

Informar e-mail. 

Informar senha. 

Validar credenciais. 

Abrir Dashboard. 

## 6. Caso de Uso – Planejar uma Pescaria

**UC-003**

Esse será um dos principais fluxos do sistema.

**Fluxo**

Usuário abre o FishGuide.
↓
Sistema identifica localização.
↓
Consulta APIs.
↓
Obtém:

- clima 
- maré 
- lua 
- vento 
- pressão 
- nascer do sol 
↓
Calcula Índice Inteligente.
↓
Mostra melhores horários.
↓
Mostra locais próximos.
↓
Mostra espécies.
↓
Usuário escolhe um local.
↓
Sistema mostra rota.
↓
Usuário salva como planejamento.

## 7. Caso de Uso – Registrar uma Pescaria

**UC-004**

Fluxo

Usuário abre Diário.
↓
Novo Registro.
↓
Seleciona local.
↓
Seleciona espécie.
↓
Informa peso.
↓
Informa comprimento.
↓
Adiciona fotos.
↓
Sistema salva automaticamente:

- clima 
- maré 
- lua 
- pressão 
- horário 
- localização 
↓
Registro salvo.

## 8. Caso de Uso – Compartilhar Captura

**UC-005**

Usuário escolhe um registro.
↓
Clique em Compartilhar.
↓
Escolhe privacidade.

Público 

Amigos 

Grupo 

Privado 
↓
Publica.
↓
Comunidade visualiza.
↓
Recebe curtidas.
↓
Recebe comentários.

## 9. Caso de Uso – Avaliar Pesqueiro

**UC-006**

Fluxo

Selecionar local.
↓
Avaliar.
↓
Informar:

- Segurança 

Estrutura 

Acesso 

Limpeza 

Facilidade 
↓
Avaliação publicada.

## 10. Caso de Uso – Publicar Dica

**UC-007**

Usuário escreve artigo.
↓
Seleciona categoria.
↓
Adiciona fotos.
↓
Publica.
↓
Outros usuários comentam.

## 11. Caso de Uso – Criar Evento

**UC-008**

Criar evento.
↓
Escolher local.
↓
Escolher data.
↓
Número máximo de participantes.
↓
Descrição.
↓
Publicar.
↓
Usuários confirmam presença.

## 12. Caso de Uso – Chat

**UC-009**

Usuário abre conversa.
↓
Seleciona amigo.
↓
Troca mensagens.
↓
Compartilha localização.
↓
Compartilha pescaria.

## 13. Caso de Uso – Consultar Espécie

**UC-010**

Pesquisar peixe.
↓
Abrir detalhes.
↓
Visualizar:

- descrição 
- habitat 
- alimentação 
- melhor maré 
- melhor lua 
- melhor horário 
- melhores iscas 
- locais frequentes 

## 14. Caso de Uso – Consultar Pesqueiro

**UC-011**

Pesquisar local.
↓
Abrir mapa.
↓
Visualizar:

- espécies 
- fotos 
- estrutura 
- avaliações 
- rota 
- previsão 
- maré 

## 15. Caso de Uso – Receber Alertas

**UC-012**

Usuário define preferências.
↓
Sistema monitora.
↓
Quando condições forem atendidas:

- Enviar notificação.

Exemplo:

- "Hoje entre 05:40 e 07:15 haverá excelentes condições para robalo no Mosqueiro."

## 16. Caso de Uso – IA (Versão Futura)

**UC-013**

Usuário possui histórico.
↓
IA analisa registros.
↓
Encontra padrões.
↓
Sugere:

- melhor horário 
- melhor maré 
- melhor lua 
- melhor equipamento 
- melhor isca 
- local recomendado 

## 17. Fluxo de Compartilhamento Inteligente

Esse será um dos diferenciais do FishGuide.

Quando um usuário compartilhar uma captura:

- Nova Captura
↓
Deseja compartilhar?
↓
SIM
↓
Escolher nível de privacidade

○ Público

○ Apenas Amigos

○ Grupo

○ Aproximado

○ Ocultar Localização
↓
Publicar

Se escolher:

- **Público**

Mostrar coordenadas.

**Amigos**

Mostrar apenas para amigos.

**Grupo**

Somente membros.

**Aproximado**

Mostrar um círculo de 500 metros ou 2 km.

**Oculto**

Não mostrar localização.

## 18. Fluxo do Índice Inteligente

Localização
      ↓
Consultar APIs
      ↓
Clima

Maré

Lua

Pressão

Vento

Sol
↓
Motor de Regras
↓ 
Índice de Pesca
      	↓
Sugestões

## 19. Fluxo da Comunidade

Usuário
↓
Nova Publicação
↓
Foto
↓
Captura
↓
Comentário
↓
Comunidade
↓
Curtidas
↓
Comentários
↓
Compartilhamentos
↓
Ranking

## 20. Fluxo Administrativo

Administrador
↓
Painel
↓
Gerenciar

Usuários 

Locais 

Espécies 

Publicações 

Eventos 

Denúncias 

APIs 

Configurações 

## 21. Fluxos de Exceção

**APIs indisponíveis**

O sistema exibirá os últimos dados válidos armazenados em cache e informará ao usuário o horário da última atualização.

**Sem conexão com a internet**

No modo PWA, serão exibidos os dados sincronizados anteriormente e o usuário poderá consultar registros locais e criar novos registros para sincronização posterior.

**Local não cadastrado**

O usuário poderá sugerir um novo ponto de pesca. A sugestão ficará pendente de validação por moderadores antes de se tornar pública.

## 22. Fluxos que eu acrescentaria

**📡 Modo "Estou Pescando"**

Esse pode ser um dos recursos mais interessantes.

Ao ativá-lo, o sistema:

- registra automaticamente o horário de início; 
- acompanha a localização (com consentimento); 
- atualiza clima, maré e pressão durante a pescaria; 
- permite registrar capturas em tempo real; 
- gera um relatório completo ao finalizar a pescaria. 

**🚤 Planejamento Completo da Saída**

Além de dizer que o dia está bom para pescar, o FishGuide pode responder:

- Qual o melhor horário para sair de casa? 

Quando chegar ao local? 

Quando começa a maré ideal? 

Quanto tempo ela dura? 

Qual o melhor horário para trocar de isca? 

Qual o melhor momento para encerrar a pescaria? 

Isso transforma o sistema em um verdadeiro assistente de planejamento.

**🧠 Perfil do Pescador**

Cada usuário terá um perfil construído automaticamente ao longo do tempo, por exemplo:

- espécies mais capturadas; 
- modalidade preferida; 
- horário em que mais pesca; 
- melhores resultados por estação do ano; 
- locais favoritos; 
- iscas mais utilizadas; 
- taxa de sucesso por condição climática. 

Essas informações serão a base para recomendações personalizadas no futuro.