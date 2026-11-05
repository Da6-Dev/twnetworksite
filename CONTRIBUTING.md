# 🤝 Guia de Contribuição — TW Network

Agradecemos o seu interesse em contribuir para o portal e ecossistema da **TW Network**! Para manter a integridade, alta performance e segurança de produção do nosso site e servidor de Minecraft, siga as diretrizes abaixo.

---

## 🧭 Princípios e Diretrizes Mestre

1. **Segundo Cérebro (Obsidian Vault):** Todas as decisões de arquitetura e modelos de dados residem na pasta `vault/`. Consulte sempre `vault/00 - MOC (Map of Content).md` antes de realizar grandes mudanças estruturais.
2. **Segurança em Primeiro Lugar:** Nunca suba arquivos `.env` ou chaves de API. O servidor possui checagens rigorosas de inicialização (*fail-fast*) que rejeitam chaves de teste em produção.
3. **Identidade Visual Minecraft:** Todos os ícones do jogo devem obrigatoriamente utilizar o componente `<McIcon name="..." />` consumindo os arquivos locais de `public/mc-icons/`.

---

## 🛠️ Configuração do Ambiente Local

1. Certifique-se de estar utilizando **Node.js 20+**.
2. Clone o repositório e instale as dependências:
   ```bash
   git clone https://github.com/Da6-Dev/twnetworksite.git
   cd twnetworksite
   npm install
   ```
3. Crie o seu arquivo `.env` baseado no `.env.example.production`:
   ```bash
   cp .env.example.production .env
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## 📜 Convenção de Commits (Conventional Commits)

Utilizamos mensagens semânticas em nossos commits:

- `feat:` Uma nova funcionalidade ou página no site.
- `fix:` Correção de um bug ou inconsistência visual.
- `docs:` Alterações na documentação (`README.md`, `vault/`, etc.).
- `style:` Formatação de estilos CSS/Tailwind sem alterar lógica de negócio.
- `refactor:` Refatoração de código sem alterar comportamento.
- `perf:` Mudança de código que melhora a performance de renderização ou tempo de resposta.
- `chore:` Ajustes de configurações, dependências ou scripts de build.

Exemplo:
```bash
git commit -m "feat(loja): adicionar novo pacote de cash com desconto sazonal"
```

---

## 🧪 Verificações Obrigatórias Antes do Push

Antes de abrir um Pull Request, certifique-se de que os seguintes comandos rodam limpos:

```bash
# 1. Executar verificação rápida de linter
npm run lint

# 2. Testar compilação de produção do Vite
npm run build
```

---

## 📬 Abrindo um Pull Request

1. Crie uma branch descritiva a partir de `main`:
   ```bash
   git checkout -b feature/minha-melhoria
   ```
2. Faça os seus commits e envie para o seu fork ou branch remota:
   ```bash
   git push origin feature/minha-melhoria
   ```
3. Abra o Pull Request preenchendo o template fornecido. Nossa suíte de CI (`ci.yml`) validará automaticamente o código.
