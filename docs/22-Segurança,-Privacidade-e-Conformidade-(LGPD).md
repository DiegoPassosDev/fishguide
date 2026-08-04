# Segurança, Privacidade e Conformidade (LGPD)

- **Projeto:** FishGuide
- **Versão:** 1.0
- **Domínio:** Technology
- **Status:** Approved
- **Proprietário:** Diego Passos
- **Última revisão:** 2026-08-03

## 1. Objetivo

Definir todas as políticas e mecanismos de segurança do FishGuide para proteger:

- dados pessoais; 
- localização; 
- histórico de pescarias; 
- informações da comunidade; 
- infraestrutura da plataforma. 

Além disso, garantir conformidade com a legislação aplicável, especialmente a **Lei Geral de Proteção de Dados (LGPD)**.

## 2. Princípios

Toda decisão relacionada à segurança deverá seguir estes princípios.

**Privacidade por padrão (Privacy by Default)**

O usuário começa com o máximo de privacidade.

Ele escolhe o que deseja compartilhar.

Nunca o contrário.

**Segurança por projeto (Security by Design)**

Toda funcionalidade deverá nascer considerando segurança.

Ela nunca será adicionada apenas no final do desenvolvimento.

**Transparência**

O usuário sempre saberá:

- quais dados são coletados; 
- por que são coletados; 
- como são utilizados; 
- com quem podem ser compartilhados. 

**Controle do Usuário**

Todos os dados pertencem ao usuário.

O FishGuide apenas os armazena e processa conforme as permissões concedidas.

## 3. Classificação dos Dados

Os dados serão classificados por nível de sensibilidade.

**Público**

- espécies; 
- artigos; 
- pesqueiros públicos; 
- conteúdo institucional. 

**Compartilhável**

- fotos; 
- relatos; 
- comentários; 
- avaliações. 

Sempre conforme a configuração do usuário.

**Privado**

- histórico pessoal; 
- estatísticas; 
- equipamentos; 
- preferências; 
- missões. 

**Altamente Sensível**

- localização em tempo real; 
- coordenadas exatas de capturas; 
- rotas; 
- dados de autenticação; 
- informações financeiras (caso existam). 

## 4. Localização Inteligente

Este será um diferencial do FishGuide.

O usuário poderá escolher o nível de precisão das localizações compartilhadas.

**Privado**

Somente o usuário visualiza.

**Aproximado**

Mostrar apenas uma área geral.

Exemplo:

- "Estuário do Mosqueiro"

Sem coordenadas.

**Comunidade**

Mostrar apenas a região.

Nunca o ponto exato.

**Público**

Compartilhamento completo.

Apenas quando o usuário desejar.

## 5. Modo Local Secreto

Uma funcionalidade exclusiva.

O usuário poderá marcar um pesqueiro como:

- **Local Secreto**

Nesse caso:

- não aparecerá para outros usuários; 
- não será utilizado em mapas públicos; 
- não aparecerá na comunidade; 
- apenas estatísticas agregadas poderão alimentar a Memória Coletiva da Pesca, sem revelar a origem. 

## 6. Consentimento

Toda coleta de dados dependerá de consentimento quando exigido por lei.

Exemplos:

- localização; 
- notificações; 
- câmera; 
- galeria; 
- analytics; 
- personalização. 

O consentimento poderá ser alterado a qualquer momento.

## 7. Direitos do Usuário

O FishGuide oferecerá mecanismos para que o usuário possa:

- acessar seus dados; 
- corrigir informações; 
- exportar seus registros; 
- excluir sua conta; 
- revogar consentimentos. 

## 8. Exportação

O usuário poderá exportar:

- pescarias; 
- capturas; 
- fotos (quando possível); 
- estatísticas; 
- equipamentos; 
- histórico. 

Em formato aberto.

Exemplo:

- JSON; 
- CSV; 
- PDF (relatórios). 

## 9. Exclusão

Ao excluir a conta:

- dados pessoais serão removidos; 
- autenticação será invalidada; 
- informações públicas serão anonimizadas quando necessário; 
- registros agregados utilizados na Memória Coletiva permanecerão apenas de forma irreversivelmente anonimizada, quando permitido pela legislação. 

## 10. Criptografia

Todos os dados sensíveis serão protegidos.

**Em trânsito**

HTTPS/TLS.

**Em repouso**

Criptografia no banco de dados e em backups.

**Senhas**

Hash utilizando algoritmos modernos (como Argon2id).

Nunca armazenadas em texto puro.

## 11. Autenticação

Suporte para:

- e-mail e senha; 
- autenticação social (Google e Apple); 
- autenticação em dois fatores (2FA) para quem desejar. 

## 12. Autorização

Controle por papéis (RBAC).

Perfis previstos:

- Usuário; 
- Moderador; 
- Administrador; 
- Parceiro; 
- Guia de Pesca. 

Cada perfil terá permissões específicas.

## 13. Auditoria

Toda ação relevante será registrada.

Exemplos:

- login; 
- alteração de perfil; 
- exclusão de registros; 
- moderação; 
- mudanças administrativas. 

Esses registros serão protegidos contra alterações indevidas.

## 14. Segurança das APIs

As APIs deverão possuir:

- autenticação JWT; 
- expiração de tokens; 
- renovação segura; 
- rate limiting; 
- proteção contra ataques automatizados. 

## 15. Upload de Arquivos

Toda imagem enviada será validada.

Verificações:

- formato; 
- tamanho; 
- tipo MIME; 
- varredura contra arquivos maliciosos. 

## 16. Backups

Backups automáticos.

Estratégia sugerida:

- incremental diário; 
- completo semanal; 
- retenção definida por política operacional. 

Os backups também deverão ser criptografados.

## 17. Monitoramento

Eventos monitorados:

- tentativas de login suspeitas; 
- excesso de requisições; 
- alterações críticas; 
- indisponibilidade de serviços; 
- erros de autenticação. 

## 18. Segurança da Comunidade

O FishGuide utilizará mecanismos para reduzir abusos.

Exemplos:

- denúncias; 
- moderação; 
- reputação; 
- limitação de spam; 
- detecção de comportamento automatizado. 

## 19. Segurança da IA

A IA nunca poderá:

- revelar informações privadas de outros usuários; 
- inferir localizações secretas; 
- expor pescarias privadas; 
- utilizar dados sem autorização. 

Toda recomendação será baseada apenas nas permissões disponíveis.

## 20. Ética e Conservação

O FishGuide adotará princípios que incentivem a pesca responsável.

Exemplos:

- alertas sobre períodos de defeso; 
- aviso de áreas protegidas; 
- incentivo à captura e soltura quando apropriado; 
- informações educativas sobre preservação ambiental. 

A plataforma deverá contribuir para a conservação dos ambientes aquáticos.

## 21. Conformidade

Além da LGPD, a arquitetura será preparada para facilitar adequações a legislações internacionais de privacidade, caso o FishGuide seja expandido para outros países.

## 22. O recurso que considero um diferencial

**Cofre Digital do Pescador**

Cada usuário terá um espaço privado onde poderá armazenar:

- locais secretos; 
- estratégias pessoais; 
- anotações; 
- equipamentos; 
- missões futuras. 

Esses dados nunca serão compartilhados automaticamente e poderão ser protegidos por autenticação adicional.

## 23. A ideia que considero mais inovadora

**Índice de Confiança da Comunidade**

Assim como temos o **FG Score**, teremos um mecanismo para avaliar a qualidade das informações compartilhadas.

Esse índice poderá considerar fatores como:

- consistência dos registros ao longo do tempo; 
- confirmação por outros pescadores; 
- qualidade das fotos e informações; 
- participação responsável na comunidade; 
- histórico de contribuições úteis. 

O objetivo **não é classificar pessoas**, mas medir a confiabilidade das informações compartilhadas. Um relato consistente e bem documentado terá mais peso na Memória Coletiva da Pesca do que uma publicação isolada ou sem evidências.