# Motor Inteligente de Pesca (Fishing Intelligence Engine)

- **Projeto:** FishGuide
- **Versão:** 1.0
- **Domínio:** Application
- **Status:** Approved
- **Proprietário:** Diego Passos
- **Última revisão:** 2026-08-03

## Objetivo

Criar um mecanismo responsável por analisar centenas de informações e transformá-las em recomendações simples para o pescador.

Esse motor será responsável por alimentar praticamente toda a plataforma.

Exemplo:

- Tela HOJE 

Alertas 

Recomendações 

Planejamento 

Estatísticas 

IA futura 

**Conceito**

O FishGuide nunca deverá dizer apenas:

- Temperatura: 28°C

Ele deverá responder:

- "Hoje existe uma alta probabilidade de captura de robalos entre 05:40 e 07:10."

Essa é a missão do Motor Inteligente.

**Como o Motor funcionará**

APIs
↓
Banco de Dados
↓
Histórico do Usuário
↓
Conhecimento da Comunidade
↓
Motor Inteligente
↓
Pontuação
↓
Recomendação
↓
Tela HOJE

**Camadas do Motor**

Eu dividiria o motor em cinco grandes camadas.

**Camada 1**

**Dados Externos**

Recebe informações como:

- clima 
- maré 
- lua 
- vento 
- pressão 
- chuva 
- nebulosidade 
- nascer do sol 
- pôr do sol 
- nascer da lua 
- pôr da lua 

**Camada 2**

**Base Biológica**

Cada espécie terá suas preferências.

Exemplo:

- Robalo
- melhor maré 
- melhor lua 
- temperatura ideal 
- velocidade máxima do vento 
- iscas 
- horário 

Camurim

- horário 
- pressão 
- maré 

Xaréu

- profundidade 
- correnteza 

Cada peixe terá uma "ficha técnica" utilizada pelo motor.

**Camada 3**

**Histórico do Usuário**

O sistema aprenderá com cada pescaria.

Exemplo

Diego costuma capturar robalos:

- entre 06h e 08h; 
- usando camarão vivo; 
- no Mosqueiro; 
- com maré enchente. 

Essas informações passam a influenciar futuras recomendações.

**Camada 4**

**Inteligência Coletiva**

Aqui entra a comunidade.

Imagine:

- 10.000 pescadores.

Cada pescaria registrada gera conhecimento.

O sistema poderá descobrir:

- Na Praia X:
- robalos aparecem principalmente na lua crescente. 

No Rio Y:

- camurins aparecem com pressão acima de 1016 hPa. 

Esses padrões serão aprendidos continuamente.

**Camada 5**

**Motor de Regras**

O motor mistura:

- Dados oficiais.

Histórico pessoal.

Conhecimento coletivo.

Preferências do usuário.

Resultado.

Recomendação.

**Índice FishGuide**

O índice será de:

- 0

- até

100

Classificação.

95-100

Extraordinário

90-94

Excelente

80-89

Muito Bom

70-79

Bom

60-69

Regular

40-59

Ruim

0-39

Muito Ruim

**Componentes do Índice**

Inicialmente, eu trabalharia com pesos configuráveis, em vez de uma fórmula fixa.

Esses valores poderão ser calibrados com o tempo.

**Cálculo por espécie**

Um ponto importante: o índice não deve ser único.

Na verdade teremos vários índices.

Exemplo.

Robalo

92

Camurim

75

Xaréu

68

Pescada

81

Depois o sistema calcula o índice geral do dia.

Assim, a Tela **HOJE** poderá dizer:

- Hoje é um excelente dia para robalo, bom para pescada e regular para xaréu.

**Cálculo por Local**

Outro detalhe importante.

O Mosqueiro pode estar excelente.

Enquanto a Atalaia pode estar ruim.

Então teremos índices individuais.

Exemplo.

Mosqueiro

95

Caueira

81

Atalaia

65

**Cálculo por Horário**

Também não existe apenas um índice por dia.

Teremos uma curva.

04h

55

05h

72

06h

95

07h

98

08h

92

09h

75

10h

60

Isso permitirá desenhar um gráfico na Tela **HOJE**.

**Recomendações Inteligentes**

Ao invés de apenas mostrar números.

O sistema escreverá frases.

Exemplo.

A maré enchente começará às 05:30. O melhor período será entre 05:45 e 07:40.

Outro exemplo.

A pressão permanece estável há 18 horas, aumentando as chances de captura.

Outro.

O vento mudará para sudeste às 10:20. Considere encerrar a pescaria antes desse horário.

**Perfil do Usuário**

Cada pescador terá um perfil criado automaticamente.

Exemplo.

Modalidade preferida

Barranco

Peixe favorito

Robalo

Melhor horário

06h

Melhor lua

Crescente

Melhor maré

Enchente

Melhor isca

Camarão Vivo

**Aprendizado Contínuo**

O motor será dividido em três fases.

**Fase 1**

Motor baseado em regras.

Tudo configurado manualmente.

**Fase 2**

Motor híbrido.

Regras.

Histórico.

**Fase 3**

IA.

Aprenderá automaticamente.

**Recomendações da Tela HOJE**

A tela principal poderá responder.

Hoje vale a pena pescar.

★★★★★

Saia às

04:50

Pesque entre

05:40

- e

07:15

Melhor local

Mosqueiro

Peixe recomendado

Robalo

Isca

Camarão Vivo

**Meu maior diferencial**

Agora vem a ideia que acho que pode tornar o FishGuide único.

**🎣 Missão de Pesca**

Em vez de apenas recomendar um local, o FishGuide cria uma missão personalizada.

Exemplo:

- MISSÃO DE HOJE

Objetivo

Capturar Robalo

★★★★★

Saída

04:55

Chegada

05:30

Maré

Enchente

Lua

Crescente

Melhor Isca

Camarão Vivo

Tempo estimado

3 horas

Probabilidade

92%

Ou seja, o usuário não recebe apenas dados; ele recebe um plano de ação.

**Outro diferencial**

**🧠 "Por que estou recomendando isso?"**

Todo resultado do índice poderá ser explicado.

Exemplo.

Sua chance de sucesso aumentou porque:

- a maré está enchendo; 
- a pressão permanece estável há 12 horas; 
- você já capturou robalos neste local em condições semelhantes; 
- outros usuários registraram boas capturas aqui nas últimas semanas. 

Essa transparência ajuda o usuário a confiar nas recomendações e também a aprender mais sobre os fatores que influenciam a pesca.

|          Fator          |  Peso inicial  |
|-------------------------|----------------|
| Maré                    | 25%            |
| Pressão atmosférica     | 20%            |
| Horário                 | 15%            |
| Lua                     | 15%            |
| Vento                   | 10%            |
| Clima                   | 5%             |
| Histórico do usuário    | 5%             |
| Inteligência coletiva   | 5%             |