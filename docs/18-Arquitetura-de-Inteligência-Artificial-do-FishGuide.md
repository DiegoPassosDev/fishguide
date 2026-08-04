# Arquitetura de Inteligência Artificial do FishGuide

- **Projeto:** FishGuide
- **Versão:** 1.0
- **Domínio:** Application
- **Status:** Approved
- **Proprietário:** Diego Passos
- **Última revisão:** 2026-08-03

## 1. Objetivo

A Inteligência Artificial do FishGuide não tem como objetivo substituir o pescador.

Ela existe para:

- explicar recomendações; 
- identificar padrões; 
- auxiliar decisões; 
- aprender com a comunidade; 
- transformar dados em conhecimento. 

Ela será um **copiloto inteligente**.

Nunca o comandante.

## 2. Filosofia

A IA sempre deverá obedecer três princípios.

**Transparência**

Toda resposta deverá ser explicável.

**Evidências**

Nunca inventar informações.

Sempre utilizar:

- dados oficiais; 
- FG Score; 
- DNA da Pescaria; 
- Memória Coletiva da Pesca; 
- histórico do usuário. 

**Humildade**

Quando não houver dados suficientes.

A IA deverá responder.

"Não possuo informações suficientes para recomendar com alta confiança."

Nunca inventar.

## 3. Arquitetura

APIs Oficiais
       │
       ▼
FG Score Engine
       │
       ▼
Decision Engine
       │
       ▼
Memória Coletiva da Pesca
       │
       ▼
FishGuide AI
       │
       ▼
Usuário

A IA nunca consultará APIs diretamente.

Ela utilizará o conhecimento consolidado pelo backend.

## 4. Fontes de Conhecimento

A IA poderá consultar:

- clima; 
- marés; 
- fases da lua; 
- espécies; 
- pesqueiros; 
- histórico pessoal; 
- capturas; 
- equipamentos; 
- comunidade; 
- DNA Ambiental; 
- DNA da Estratégia; 
- recomendações anteriores. 

## 5. Assistente FishGuide

O usuário poderá conversar naturalmente.

Exemplos:

- Vale a pena sair hoje?

Onde tenho mais chance de pegar robalo?

Qual isca costuma funcionar melhor nesse local?

Como foi minha última pescaria?

Compare hoje com sábado passado.

Vale esperar a maré virar?

## 6. Respostas Inteligentes

A IA responderá utilizando.

- texto; 
- gráficos; 
- mapas; 
- comparações; 
- links internos. 

Nunca apenas texto.

## 7. Memória Pessoal

O sistema conhecerá o estilo do usuário.

Exemplo.

Você normalmente pesca:

- entre 05h e 08h; 
- robalo; 
- camarão vivo; 
- estuários. 

Esses dados serão considerados nas respostas.

## 8. Memória Coletiva da Pesca

Este é um dos pilares do FishGuide.

A IA poderá consultar milhões de pescarias registradas.

Mas apenas de forma agregada e anonimizada.

Exemplo.

Em condições semelhantes às de hoje.

Encontramos.

3.421 pescarias.

Taxa média de sucesso.

73%.

Espécie mais capturada.

Robalo.

Melhor horário.

06h15.

Isso transforma a experiência coletiva em conhecimento útil.

## 9. Reconhecimento por Imagem

O usuário envia uma foto.

A IA poderá identificar.

- espécie; 
- tamanho aproximado; 
- possíveis características; 
- nível de confiança. 

Nunca substituirá uma identificação oficial quando houver dúvida.

## 10. Reconhecimento do Ambiente

Outra possibilidade futura.

Enviar uma foto do local.

A IA poderá identificar.

- manguezal; 
- costão; 
- rio; 
- estuário; 
- praia; 
- vegetação; 
- estrutura. 

Essas informações poderão enriquecer automaticamente o DNA da Pescaria.

## 11. Geração Automática de Diário

Ao finalizar a pescaria.

A IA poderá gerar.

Exemplo.

Hoje você pescou entre 05h40 e 08h15 no Mosqueiro. As melhores condições ocorreram durante a maré enchente. Foram registradas quatro capturas, sendo três robalos e uma pescada. O FG Score previsto foi de 91 e o resultado confirmou a tendência observada em pescarias semelhantes.

O usuário poderá editar antes de salvar.

## 12. Explicação das Recomendações

A IA nunca responderá apenas.

"Porque sim."

Ela mostrará.

- quais fatores influenciaram; 
- peso de cada fator; 
- dados históricos; 
- comparação com pescarias semelhantes. 

## 13. Aprendizado

O aprendizado ocorrerá em fases.

**Fase 1**

Regras.

**Fase 2**

Histórico.

**Fase 3**

Machine Learning.

**Fase 4**

Aprendizado contínuo.

Sempre supervisionado.

## 14. Segurança

A IA nunca poderá.

- alterar dados; 
- excluir informações; 
- aprovar conteúdos; 
- tomar decisões administrativas. 

Ela apenas recomenda.

## 15. IA para a Comunidade

A IA ajudará moderadores.

Exemplos.

- detectar spam; 
- identificar fotos duplicadas; 
- sugerir categorias; 
- encontrar informações inconsistentes. 

A decisão final continuará sendo humana.

## 16. IA para Espécies

A IA poderá comparar registros.

Exemplo.

Esta captura possui 93% de probabilidade de ser um robalo-flecha.

Mostrando também espécies semelhantes.

## 17. IA para Planejamento

Antes da pescaria.

O usuário pergunta.

Tenho quatro horas livres amanhã.

A IA responde.

- melhor horário; 
- melhor local; 
- espécie mais promissora; 
- equipamentos sugeridos; 
- iscas recomendadas; 
- previsão do tempo; 
- FG Score esperado. 

## 18. IA Offline

Mesmo sem internet.

O aplicativo poderá responder perguntas simples utilizando.

- últimos dados sincronizados; 
- histórico local; 
- preferências do usuário. 

## 19. Evolução

Toda recomendação poderá ser comparada com o resultado real.

Assim o sistema saberá.

A previsão foi boa?

O resultado foi diferente?

O algoritmo precisa evoluir?

## 20. O conceito que considero revolucionário

**Conselheiro Virtual de Pesca**

Não será um chatbot comum.

Será um especialista que conhece.

- seu histórico; 
- seu equipamento; 
- seus locais favoritos; 
- seus horários; 
- suas espécies; 
- sua região. 

Ele responderá como alguém que pescou com você durante anos.

Exemplo.

Diego, normalmente você obtém melhores resultados no Mosqueiro quando a maré começa a encher e o vento está abaixo de 10 km/h. Hoje essas condições devem ocorrer por volta das 06h20. Se eu fosse montar sua missão, recomendaria sair às 05h15 e utilizar camarão vivo ou um plug de meia água.

Observe que ele explica **por que** está recomendando isso.

## 21. Minha maior ideia até agora

Enquanto escrevia este documento, surgiu um conceito que acredito poder se tornar o verdadeiro diferencial do FishGuide.

**🌍 Gêmeo Digital dos Pesqueiros (Digital Twin)**

Hoje falamos muito sobre o DNA da Pescaria.

Mas e se cada **pesqueiro** também tivesse uma identidade viva?

Cada local passaria a possuir um **Gêmeo Digital**, atualizado continuamente com informações como:

- comportamento das marés; 
- histórico de capturas; 
- espécies predominantes por estação; 
- influência dos ventos; 
- pressão atmosférica; 
- temperatura da água; 
- transparência da água (quando disponível); 
- eventos climáticos; 
- frequência de pescarias; 
- evolução ao longo dos anos. 

Na prática, cada pesqueiro deixaria de ser apenas um ponto no mapa e se tornaria um organismo digital em constante aprendizado.

Quando um usuário abrisse o perfil do Mosqueiro, por exemplo, ele não veria apenas fotos e comentários.

Veria um retrato vivo daquele ambiente:

- quais espécies estão mais ativas nesta época; 
- como o local responde a diferentes fases da lua; 
- quais estratégias tiveram maior sucesso; 
- como o comportamento mudou em relação aos últimos anos. 

Esse Gêmeo Digital seria alimentado pelo **FG Score Engine**, pelos **DNAs das Pescarias**, pela **Memória Coletiva da Pesca** e pelas integrações com dados oficiais.

Na minha visão, isso transforma o FishGuide em uma plataforma que não apenas registra pescarias, mas **compreende a evolução dos ambientes de pesca ao longo do tempo**.