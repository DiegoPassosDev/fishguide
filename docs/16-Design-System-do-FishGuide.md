# Design System do FishGuide

- **Projeto:** FishGuide
- **Versão:** 1.0
- **Domínio:** Application
- **Status:** Approved
- **Proprietário:** Diego Passos
- **Última revisão:** 2026-08-03

## 1. Objetivo

Definir toda a identidade visual e os padrões de interface do FishGuide, garantindo consistência, acessibilidade e escalabilidade.

## 2. Princípios do Design

Toda decisão visual deve seguir cinco princípios.

**Clareza**

A informação mais importante deve ser percebida em menos de 3 segundos.

**Simplicidade**

Poucos elementos.

Muito espaço.

Nada de telas poluídas.

**Natureza**

Toda a identidade será inspirada em:

- água 
- céu 
- nascer do sol 
- manguezal 
- vegetação 
- madeira 
- areia 

**Confiança**

O pescador deve sentir que está utilizando uma ferramenta profissional.

**Emoção**

O aplicativo deve despertar vontade de pescar.

## 3. Paleta Oficial

**Primárias**

**Secundárias**

## 4. Tipografia

Fonte principal:

- **Inter**

Fonte para números importantes:

- **Roboto Mono**

Exemplos:

- Índice FishGuide

92/100

05:42

1017 hPa

Números técnicos ficam extremamente legíveis.

## 5. Escala Tipográfica

## 6. Espaçamentos

Sistema baseado em 8 pixels.

4

8

16

24

32

48

64

Todos os componentes seguirão essa escala.

## 7. Bordas

Cartões

16px

Botões

12px

Inputs

10px

Nada com cantos totalmente quadrados.

## 8. Sombras

Sombras discretas.

A interface deve parecer leve.

Evitar sombras muito fortes.

## 9. Ícones

Biblioteca:

- **Lucide React**

Estilo:

- Outline

Sempre.

## 10. Componentes Base

Todo o sistema será construído sobre componentes reutilizáveis.

Exemplos.

Button

Card

Badge

Avatar

Alert

Input

Textarea

Select

Dialog

Drawer

Tooltip

Tabs

Table

Skeleton

Map

Chart

## 11. Card Base

Todos os cards terão o mesmo padrão.
┌────────────────────────────┐
Título

Subtítulo

Conteúdo

Ações

Rodapé
└────────────────────────────┘

## 12. Card do Índice FishGuide

Este será o componente mais importante da aplicação.

Exemplo.

★★★★★

Índice FishGuide

92

Excelente

Confiança

96%

Ele deverá ocupar posição de destaque na tela HOJE.

## 13. Card da Missão

🎣

Missão de Hoje

Mosqueiro

05:40 às 07:15

Robalo

Camarão Vivo

Será o segundo card mais importante.

## 14. Cards Técnicos

Todos os demais seguirão o mesmo padrão.

Maré 

Clima 

Lua 

Pressão 

Vento 

Sol 

Espécies 

## 15. Botões

Teremos apenas quatro estilos.

**Primário**

Azul.

**Secundário**

Branco.

**Sucesso**

Verde.

**Perigo**

Vermelho.

## 16. Badges

Exemplo.

Excelente

Bom

Ruim

Lua Cheia

Maré Enchente

Favorito

## 17. Skeleton

Toda tela carregará Skeletons.

Nunca spinners gigantes.

## 18. Estados

Todo componente possuirá.

Loading.

Success.

Error.

Offline.

Empty.

## 19. Microanimações

Animações curtas.

Exemplos.

- aparecer card; 
- registrar captura; 
- concluir missão; 
- favoritar local. 

Duração sugerida:

- 150–250 ms.

## 20. Feedback Visual

Quando o usuário registrar uma captura.

A tela deverá responder imediatamente.

Exemplo.

🐟

Robalo registrado

+1 captura

★★★★★

## 21. Acessibilidade

Todo componente deverá possuir:

- contraste adequado; 
- navegação por teclado; 
- suporte a leitores de tela; 
- foco visível; 
- tamanhos mínimos para toque. 

O objetivo é atender às recomendações da WCAG 2.2.

## 22. Modo Escuro

Não será uma simples inversão de cores.

Será inspirado em uma pescaria noturna.

Exemplo.

Fundo:

- Azul profundo.

Cards:

- Cinza escuro.

Destaques:

- Azul oceano.

Verde.

Laranja.

## 23. Responsividade

A interface será pensada inicialmente para smartphones.

Depois:

- Tablet 

Notebook 

Desktop 

Nunca o contrário.

## 24. Ilustrações

Estilo.

Flat.

Poucos detalhes.

Inspiradas em:

- barcos; 
- rios; 
- peixes; 
- vegetação; 
- faróis; 
- mar. 

## 25. Fotografias

As imagens dos usuários serão protagonistas.

A interface deve valorizá-las, evitando excesso de elementos decorativos.

## 26. Ícones das Espécies

Aqui proponho um diferencial.

Cada espécie poderá possuir um ícone simplificado.

Exemplo.

🐟 Robalo

🐠 Xaréu

🦈 Tubarão

Isso facilitará o reconhecimento rápido na interface.

## 27. O recurso que considero mais interessante

**Interface Contextual**

A aparência do aplicativo poderá mudar discretamente conforme a situação da pescaria.

Exemplos:

- 🌅 Amanhecer

Tons mais quentes.

🌞 Meio-dia

Maior contraste.

🌇 Entardecer

Laranja suave.

🌙 Noite

Azul profundo.

🌧 Chuva

Contraste reforçado.

🟢 Índice excelente

Detalhes verdes.

🔴 Índice ruim

Detalhes discretamente avermelhados.

O usuário perceberá que o aplicativo está "vivo", acompanhando o ambiente.

## 28. Uma ideia exclusiva para o FishGuide

Gostaria de criar um componente chamado **Radar de Pesca**.

Não seria apenas um gráfico.

Seria uma visualização circular mostrando, ao mesmo tempo:

- índice de pesca; 
- confiança da recomendação; 
- maré; 
- vento; 
- pressão; 
- fase da lua; 
- melhor horário. 

Imagine algo semelhante ao painel de um relógio esportivo de alta qualidade.

Na Tela **HOJE**, o pescador conseguiria entender toda a situação do dia em poucos segundos, apenas olhando para esse painel.

Esse componente pode se tornar um dos elementos visuais mais marcantes do FishGuide.

|       Nome       |    HEX    |        Uso         |
|------------------|-----------|--------------------|
| Ocean Blue       | #0B5FA5   | Principal          |
| Deep Sea         | #083D77   | Navegação          |
| Mangrove Green   | #2E7D32   | Sucesso            |
| Sand             | #F4EFE6   | Fundo secundário   |
| White            | #FFFFFF   | Fundo              |

|       Nome       |    HEX    |
|------------------|-----------|
| Sunrise Orange   | #F4A261   |
| Golden Sun       | #F6C453   |
| Coral Red        | #D62828   |
| Mist Gray        | #6B7280   |
| Sky Blue         | #EAF4FC   |

|   Elemento  |  Tamanho  |
|-------------|-----------|
| Hero        | 36px      |
| Título      | 28px      |
| Subtítulo   | 22px      |
| Card        | 18px      |
| Texto       | 16px      |
| Legenda     | 14px      |
| Auxiliar    | 12px      |