## 2026-11-04T01:13:38Z
Your working directory is c:\Users\DaviPsss\OneDrive\Documentos\GitHub\SIte Server Minecraft\twnetworksite\.agents\teamwork\auditor_1\
Your parent is 627d2860-4d26-488a-b5c0-3796a71b4bc7. Use this ID for communication via send_message.

Applicable domain skill:
c:\Users\DaviPsss\OneDrive\Documentos\GitHub\SIte Server Minecraft\twnetworksite\.agents\skills\security-misconfiguration\SKILL.md

<original_task>
This is a single self-contained fix; keep it small and focused.
Aplicar o hardening de código para produção no backend do projeto em `server.ts` e `db.ts`.

Integrity mode: development

## Requirements

### R1. Hardening em `server.ts`
Configurar `app.set('trust proxy', 1);` logo após a criação da instância do Express para que o `express-rate-limit` identifique os IPs reais dos usuários através de proxies reversos (Cloudflare / Nginx).
Configurar CORS com verificação de ambiente: em produção (`NODE_ENV === 'production'`), restringir para origens permitidas (ex: via `process.env.ALLOWED_ORIGINS` ou lista padrão `['https://twnetwork.com.br', 'https://www.twnetwork.com.br']`), mantendo aberto ou flexível em desenvolvimento local.
Implementar validação rigorosa de `JWT_SECRET`: Em produção (`NODE_ENV === 'production'`), não permitir o fallback dev fraco; lançar um erro descritivo e encerrar a inicialização caso `JWT_SECRET` não esteja definido ou esteja usando o segredo padrão de desenvolvimento.
Atualizar o endpoint `/api/health` para testar ativamente a conectividade com o banco de dados executando `await query('SELECT 1')` e retornar HTTP 500 caso o banco esteja inacessível.

### R2. Resiliência e Conexão SSL em `db.ts`
Configurar o pool de conexões (`pg.Pool`) com opções de segurança e resiliência: `max: Number(process.env.DB_POOL_MAX) || 20`, `idleTimeoutMillis: 30000`, `connectionTimeoutMillis: 5000`.
Adicionar suporte a conexão SSL quando `process.env.DB_SSL === 'true'` ou quando `NODE_ENV === 'production'` com `ssl: { rejectUnauthorized: false }` ou configuração apropriada para provedores gerenciados (Supabase, Neon, Railway, AWS RDS).

### R3. Verificação de Integridade e Compilação
Executar `npm run lint` e `npm run build` para garantir que o código compila perfeitamente sem nenhum erro de TypeScript ou estilo.

## Acceptance Criteria

### Compilação e Tipagem
- [ ] O comando `npm run lint` executa e conclui com código de saída 0 sem erros de lint.
- [ ] O comando `npm run build` compila o projeto com código de saída 0 sem erros de TypeScript.

### Hardening de Servidor (`server.ts`)
- [ ] A instância do Express possui `app.set('trust proxy', 1);` configurado logo após a inicialização.
- [ ] A configuração de CORS restringe as origens em produção para `ALLOWED_ORIGINS` ou lista padrão `['https://twnetwork.com.br', 'https://www.twnetwork.com.br']`, permitindo origens de desenvolvimento quando fora de produção.
- [ ] Em produção (`NODE_ENV === 'production'`), se `JWT_SECRET` não estiver definido ou for igual ao segredo fraco de desenvolvimento, a inicialização é encerrada com erro descritivo.
- [ ] O endpoint `/api/health` executa consulta `SELECT 1` no banco de dados e retorna HTTP 500 caso o banco esteja inacessível.

### Pool de Banco de Dados (`db.ts`)
- [ ] O pool `pg.Pool` define `max: Number(process.env.DB_POOL_MAX) || 20`, `idleTimeoutMillis: 30000` e `connectionTimeoutMillis: 5000`.
- [ ] Conexão SSL é ativada quando `process.env.DB_SSL === 'true'` ou em `NODE_ENV === 'production'`.
</original_task>

Please conduct your independent 3-phase victory audit (timeline analysis, cheating/evasion detection, and independent test execution) and report your structured verdict (confirmed or rejected).
