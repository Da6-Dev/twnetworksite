# Plano de Implementação: Recompensas Diárias & Passe de Batalha no Perfil do Jogador

Migração completa do sistema de recompensas para o perfil autenticado do jogador (vinculado ao Nick cadastrado), introdução do Calendário Diário de 7 Dias com bônus progressivos acumulativos e criação do **Passe de Batalha da Temporada** com trilha dupla interativa (Free e VIP) com níveis de progressão por XP e missões diárias/semanais concluídas.

---

## Revisão do Usuário & Decisões Confirmadas

> [!IMPORTANT]
> **Decisões alinhadas na Fase de Clarificação:**
> - **Formato de Recompensas no Perfil**: Calendário de 7 dias com bônus progressivos crescentes por login contínuo, salvo diretamente no perfil autenticado do jogador.
> - **Passe de Batalha**: Trilha dupla paralela (Free vs. VIP) com níveis de temporada, barra de XP, missões diárias com recompensas desbloqueáveis e status de reivindicação por nível.
> - **Hub de Atividades (`/atividades`)**: As recompensas serão movidas integralmente para o perfil, deixando o Hub de Atividades 100% focado e enxuto nas duas funcionalidades da comunidade: **Ranking da Temporada (Pix)** e **Status dos Modos de Jogo**.

---

## 1. Visão Geral & Conceito Central

- **O que faz**:
  1. No perfil do jogador (`/perfil`), adiciona abas dedicadas para **"Passe de Batalha"** e **"Recompensas Diárias"**.
  2. O jogador logado resgata suas recompensas diárias no seu próprio Nick, com contador de sequência de dias (Streak de 1 a 7 dias), animação de desbloqueio com som de XP do Minecraft e geração de comando de coleta in-game (`/recompensa resgatar`).
  3. Apresenta o **Passe de Batalha de Temporada (Natal RankUP)**:
     - **Trilha Gratuita (Free)**: Acessível a todos os jogadores com recompensas essenciais (Chaves Comuns, Moedas, Boosters de Mineração e Caixas).
     - **Trilha VIP / Premium**: Recompensas exclusivas para quem possui VIP ativo ou adquire o passe (Chaves Supremas, Cash in-game, Multiplicadores de Economia, Spawners e Cosméticos Natalinos).
     - **Sistema de Missões de XP**: Missões práticas que o jogador pode concluir e marcar para subir de nível no passe.
- **Público-alvo**: Jogadores autenticados da TW Network que buscam engajamento diário, evolução progressiva e vantagens in-game.

---

## 2. Experiência do Usuário & Design Visual

### Fluxos Principais
1. **Resgate do Calendário Diário (7 Dias)**:
   - Ao acessar `/perfil`, o jogador visualiza seu streak atual (ex: "Dia 3 de 7"), os dias já resgatados com carimbo verde de check, o dia de hoje pronto para coletar e os próximos dias bloqueados.
   - Clicar em "Resgatar Recompensa de Hoje" toca som de XP, marca o dia como concluído, exibe um feedback com o prêmio recebido e gera o comando `/resgatar <codigo>` para uso no servidor.
2. **Progressão no Passe de Batalha**:
   - Header do Passe com nível atual do jogador, barra de progresso de XP (ex: `1.850 / 2.500 XP`) e status de assinatura do Passe VIP (Ativo ou Comprar na Loja).
   - Trilha visual horizontal/grid com colunas de Nível 1 a 10. Cada nível exibe dois slots: slot de cima (Free) e slot de baixo (VIP com borda dourada e ícone de cadeado se não for VIP).
   - Botões interativos de "Resgatar" para níveis já alcançados e "Concluir Missão" na aba de tarefas de XP diárias.
3. **Hub de Atividades Desobstruído**:
   - O Hub (`/atividades`) agora opera com abas limpas e diretas: **Ranking da Temporada (Pix)** e **Status dos Modos em Tempo Real**, com um convite sutil para acessar o Passe no Perfil.

### Identidade Visual & Diretrizes de Design
- **Paleta 60-30-10**:
  - 60% Fundo Canvas neutro escuro/claro (`--bg-canvas`).
  - 30% Superfície de cartões com bordas sutis (`--bg-surface`, `--border-color`).
  - 10% Acentos temáticos: Dourado VIP (`--mc-gold`), Esmeralda Free (`--mc-emerald`), Diamante XP (`--mc-diamond`).
- **Disciplina Anti-Slop**:
  - Sem badges estáticas empilhadas ou pílulas falsas.
  - Tipografia nítida com números tabulares (`tabular-nums`) para XP, moedas e níveis.
  - Feedback sonoro nativo via Web Audio API (som de sino de nível e coleta).

---

## 3. Decisões de Produto & Arquitetura de Dados

- **Persistência no Perfil do Jogador**:
  - Os dados de streak diário, último dia resgatado, nível do Passe de Batalha, XP acumulado e recompensas coletadas são salvos no `AuthContext` e armazenados no `localStorage` sob a chave do Nick do usuário logado (`tw_player_profile_<nick>`).
  - Dessa forma, cada conta demo ou usuário cadastrado tem seu progresso independente e preservado entre recarregamentos.
- **Estrutura do Passe de Batalha**:
  - 10 Níveis de Temporada com recompensas balanceadas.
  - 5 Missões Diárias e Semanais (ex: "Minerar 500 blocos", "Vender R$ 50k no /mercado", "Entrar no Discord oficial", "Derrotar 20 mobs na mina PvP", "Votar no servidor no TopCraft").
- **Hub de Atividades (`PlayerHub.jsx`)**:
  - Remove o estado local anterior e a aba de recompensas do Hub, simplificando-o para as 2 abas comunitárias (Ranking Pix e Status dos Servidores).

---

## 4. Arquitetura Técnica & Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                       AuthContext & Storage                     │
│  - usuario ({ nick, email, patenteVip, ... })                  │
│  - progressoPasse ({ nivel, xp, recompensasFree, recompensasVip})│
│  - streakDiario ({ diaAtual, ultimoResgate, historicoDias })    │
└────────────────┬────────────────────────────────────────────────┘
                 │
      ┌──────────┴───────────────────────────┐
      ▼                                      ▼
┌───────────────────────────────┐  ┌───────────────────────────────┐
│   PerfilPage (/perfil)        │  │   PlayerHub (/atividades)     │
│   - Aba: Pedidos & Ativação   │  │   - Aba: Ranking Pix          │
│   - Aba: Passe de Batalha     │  │   - Aba: Status dos Modos     │
│     * Trilha Free vs VIP      │  │                               │
│     * Missões de XP           │  │   (Recompensas migradas       │
│   - Aba: Recompensas Diárias  │  │    100% para o Perfil)        │
│     * Calendário de 7 Dias    │  └───────────────────────────────┘
│   - Aba: Minha Conta          │
│   - Aba: Configurações & Som  │
└───────────────────────────────┘
```

---

## 5. Próximos Passos de Execução (Após Aprovação)

1. **Atualizar `AuthContext.jsx`**: Adicionar suporte a persistência por jogador de streak diário (calendário de 7 dias) e progressão do Passe de Batalha (níveis, XP e recompensas resgatadas).
2. **Atualizar `PlayerHub.jsx` & `PlayerHub.css`**: Retirar a aba de recompensas diárias do Hub de Atividades, ajustando a navegação para Ranking e Status dos Modos.
3. **Desenvolver o Calendário de 7 Dias e o Passe de Batalha no `PerfilPage.jsx`**:
   - Componentes visuais com trilha Free e VIP, feedback sonoro e botões de resgate interativos.
   - Painel de missões com botões de completar para ganhar XP imediatamente.
4. **Verificação & Testes**: Executar `lint_applet` e `compile_applet` para assegurar build de produção impecável.
