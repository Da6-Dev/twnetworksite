# 🛡️ Política de Segurança — TW Network

A segurança da nossa plataforma, dos dados dos nossos jogadores e das transações de pagamento é prioridade absoluta.

---

## 🔒 Relatando uma Vulnerabilidade

Se você identificou uma falha de segurança, brecha de autenticação, vulnerabilidade de injeção ou qualquer risco associado ao site ou aos webhooks de pagamento da TW Network:

> [!CAUTION]
> **NÃO abra uma Issue pública no GitHub.** A divulgação pública prematura pode colocar em risco dados e transações da comunidade.

### Como nos contatar:
1. Envie um e-mail com detalhes técnicos para: **devdapacontact@gmail.com** com o assunto `[SECURITY VULNERABILITY] TW Network`.
2. Alternativamente, abra um ticket privado com a Staff no nosso Discord oficial solicitando contato imediato com a equipe de engenharia.

### O que incluir no seu relatório:
- Descrição da vulnerabilidade (ex: OWASP A01, falha de validação de token, etc.).
- Passos reprodutíveis ou script Proof of Concept (PoC).
- Impacto potencial estimado.

Nos comprometemos a responder em até 48 horas úteis e disponibilizar a correção o mais rápido possível.

---

## 🛡️ Diretrizes de Engenharia e Defesa em Profundidade

O sistema segue rigorosas práticas de segurança:
- **Zero Hardcoded Secrets:** Nenhuma credencial de banco, token de Mercado Pago ou segredo JWT deve existir no código-fonte.
- **Fail-Fast de Produção:** O backend aborta a execução se `JWT_SECRET` for nulo ou igual ao padrão de desenvolvimento.
- **Content Security Policy (Helmet):** Restrição estrita de origens para execução de scripts e conexões.
- **Proteção Anti-Bruteforce:** Limitação de requisições por IP em endpoints sensíveis (autenticação e cupons).
