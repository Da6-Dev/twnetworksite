# 🤖 Diretrizes do Agente & Protocolo de Memória (Obsidian Vault) — TW Network

> Este arquivo é a diretriz mestre de trabalho para qualquer agente ou engenheiro de IA atuando no repositório **TW Network**.

---

## 🧠 1. Memória Central do Projeto (Super-Vault Unificado)

O repositório utiliza o **Super-Vault Unificado (Segundo Cérebro)** conectado como **Git Submodule** na pasta **`vault/`** (Repositório mestre: [`Da6-Dev/tw-vault`](https://github.com/Da6-Dev/tw-vault)).
Ele centraliza toda a inteligência do ecossistema dividida em 4 pilares:
1. `01 - Web e Loja`: Banco Neon, Mercado Pago, JWT, deploy no Render.
2. `02 - Plugins Java`: Arquitetura dos 9 módulos (`tw-core`, `tw-ranks`, `tw-minas`, etc.), concorrência e PDC.
3. `03 - Servidor e Game Loop`: Economia in-game, tabela de preços, menus, hologramas e comandos.
4. `04 - Diario de Bordo`: Registro histórico de decisões unificado da rede.

Toda a inteligência está documentada usando **Links Bidirecionais (`[[wikilinks]]`)**.

### Regras Obrigatórias de Leitura:
1. **Antes de planejar ou codificar:** Sempre consulte o índice geral em `vault/00 - MOC (Map of Content).md` e as notas técnicas relacionadas à tarefa (ex: `[[Neon PostgreSQL]]`, `[[Seguranca e Hardening]]`, `[[Mercado Pago SDK]]`, `[[02-CORE-MODULE]]`, `[[tabela_precos]]`, etc.).
2. **Respeite as Decisões Passadas:** Não altere padrões já decididos (ex: uso do pooler do Neon, porta 3000, `--include=dev` no build do Render) sem justificativa técnica e alinhamento com o usuário.

---

## 📝 2. Protocolo de Atualização da Memória (Auto-Alimentação)

Ao concluir qualquer tarefa relevante de desenvolvimento, correção de bug, alteração de banco ou deploy:
1. **Atualizar a Nota Técnica:** Se você alterou uma tabela, atualize `vault/🗄️ Banco de Dados/Tabela X.md`. Se alterou o backend, atualize `vault/🏗️ Arquitetura/Tech Stack.md` ou `[[Seguranca e Hardening]]`.
2. **Registrar no Diário de Bordo:** Crie ou atualize uma entrada diária em `vault/📅 Diário de Bordo/YYYY-MM-DD - Titulo da Tarefa.md` resumindo o que foi feito.
3. **Preservar o Grafo:** Toda nova nota deve conter links bidirecionais `[[Nome da Nota]]` e deve ser referenciada no `vault/00 - MOC (Map of Content).md` para evitar notas órfãs no Graph View do Obsidian.

---

## 🛡️ 3. Diretrizes Críticas de Segurança e Ambiente

* **NUNCA commitar `.env`:** O arquivo `.env` deve sempre permanecer ignorado no `.gitignore`. Utilize apenas `.env.example.production` para expor chaves públicas ou modelos.
* **Fail-Fast de Produção:** Mantenha a checagem no `server.ts` que bloqueia inicializações com chaves dev ou sem `JWT_SECRET` em modo de produção.
* **Build do Render:** Como `NODE_ENV=production` é padrão na nuvem, o comando de compilação deve sempre ser `npm install --include=dev && npm run build` para garantir que o Vite seja instalado.
* **Banco Neon:** A conexão em produção deve sempre usar SSL (`ssl: { rejectUnauthorized: false }`) e respeitar o endpoint `-pooler`.

---

## 🎮 4. Identidade Visual e Minecraft

* Todos os ícones do jogo devem usar o componente `<McIcon name="..." />` consumindo os arquivos locais de `public/mc-icons/` com a classe `pixelated`. Nunca utilize CDNs instáveis de terceiros para texturas do Minecraft.
