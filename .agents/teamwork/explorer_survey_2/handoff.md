# Handoff Report — Explorer 2: Server Architecture & Nginx VirtualHost Survey

## 1. Observation

### 1.1 Server Architecture and Entry Points
- **Runtime and Execution**:
  - `package.json` lines 5–10:
    ```json
    "type": "module",
    "scripts": {
      "dev": "tsx watch server.ts",
      "build": "vite build",
      "start": "tsx server.ts",
      "lint": "oxlint",
      "preview": "vite preview --host 0.0.0.0 --port 3000"
    }
    ```
  - The application runs directly via `tsx server.ts` as an ES Module (`"type": "module"`). Node.js >= 20/22 compatible.
- **Port and Network Binding**:
  - `server.ts` lines 20–22:
    ```typescript
    app.set('trust proxy', 1);
    const PORT = Number(process.env.PORT) || 3000;
    ```
  - `server.ts` line 1308:
    ```typescript
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor Full-Stack TW Network online em http://localhost:${PORT}`);
    });
    ```
  - Express binds to `0.0.0.0:3000` (or `process.env.PORT`).

### 1.2 Reverse Proxy Sensitivity (`trust proxy`) and Rate Limiting
- **Trust Proxy Setting**:
  - `server.ts` line 20: `app.set('trust proxy', 1);`.
  - Express trusts exactly 1 hop of reverse proxy (Nginx). It relies on the incoming `X-Forwarded-For` header to determine client IP (`req.ip`).
- **Rate Limiters**:
  - `server.ts` lines 79–104:
    - Global API limiter: `max: 300` per 15 minutes on `/api/`.
    - Auth limiter: `max: 20` per 15 minutes on `/api/auth/login` and `/api/auth/cadastrar`.
    - Coupon limiter: `max: 25` per 5 minutes on `/api/cupons/validar`.
  - **Crucial observation**: If Nginx does NOT properly pass `X-Forwarded-For` and `X-Real-IP`, all incoming traffic is seen as `127.0.0.1`. Under this condition, multiple users will rapidly trigger the `max: 20` or `max: 300` limit, locking out the entire application for all visitors.

### 1.3 Headers, CORS, and Security Middleware
- **Helmet and CSP**:
  - `server.ts` lines 47–62:
    ```typescript
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://accounts.google.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:", "blob:", "https://mc-heads.net", "https://*.googleusercontent.com"],
            connectSrc: ["'self'", "https://accounts.google.com", "https://api.mercadopago.com", "ws:", "wss:"],
            frameSrc: ["'self'", "https://accounts.google.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
          },
        },
        crossOriginEmbedderPolicy: false,
      })
    );
    ```
  - Notice `connectSrc` allows `'self'`, Google accounts, Mercado Pago, and explicitly `"ws:", "wss:"`.
- **CORS Configuration**:
  - `server.ts` lines 64–75:
    ```typescript
    const defaultAllowedOrigins = ['https://twnetwork.com.br', 'https://www.twnetwork.com.br'];
    const parsedAllowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim().replace(/^['"]|['"]$/g, '').replace(/\/+$/, '')).filter(Boolean)
      : [];
    const allowedOrigins = parsedAllowedOrigins.length > 0 ? parsedAllowedOrigins : defaultAllowedOrigins;

    app.use(
      cors({
        origin: isProduction ? allowedOrigins : true,
        credentials: true,
      })
    );
    ```
  - In production (`NODE_ENV === 'production'`), CORS strictly checks origins against `https://twnetwork.com.br`, `https://www.twnetwork.com.br`, or custom origins passed in `ALLOWED_ORIGINS`.

### 1.4 Production Static Asset Serving & SPA Routing in Node
- `server.ts` lines 1294–1306:
  ```typescript
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('{*splat}', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }
  ```
- In production, Node does NOT invoke Vite at runtime. It serves static files from `./dist` and falls back all unmatched routes to `./dist/index.html` using Express 5 route wildcard `{*splat}`.

### 1.5 Static Asset Locations & Vite Build Outputs
- Source assets in `public/`:
  - `public/favicon.svg` (9,522 bytes)
  - `public/icons.svg` (5,055 bytes)
  - `public/mc-icons/` (contains ~45 PNG icons: `amethyst_shard.png`, `diamond.png`, `netherite_sword.png`, etc.)
- Frontend icon references:
  - `src/components/McIcon.jsx` line 121: `imgSrc = '/mc-icons/' + resolvedKey + '.png';`
- Build outputs in `dist/` (verified via `npm run build`):
  - `dist/index.html` (1.47 kB)
  - `dist/assets/index-[hash].css` (~138 kB)
  - `dist/assets/index-[hash].js` (~786 kB)
  - `dist/mc-icons/` (copied verbatim from `public/mc-icons/`)
  - `dist/favicon.svg`, `dist/icons.svg`
- Build verification: `npm run build` completed in 689ms with exit code 0.
- Lint verification: `npm run lint` completed with exit code 0 (11 react hook/state warnings, 0 errors).

---

## 2. Logic Chain

### 2.1 Reverse Proxying to http://127.0.0.1:3000
- **Premise**: `server.ts` line 1308 listens on `PORT` (default 3000) on `0.0.0.0`.
- **Inference**: Nginx should upstream traffic directly to `http://127.0.0.1:3000` via `proxy_pass http://127.0.0.1:3000;`.
- **Premise**: `server.ts` line 20 has `app.set('trust proxy', 1);` and rate limiting relies on `req.ip`.
- **Inference**: Nginx MUST supply accurate proxy headers:
  - `proxy_set_header Host $host;`
  - `proxy_set_header X-Real-IP $remote_addr;`
  - `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`
  - `proxy_set_header X-Forwarded-Proto $scheme;`

### 2.2 WebSocket Upgrade Support
- **Premise**: R2 explicitly requires WebSocket support, and Helmet CSP allows `ws:` / `wss:`.
- **Inference**: In standard Nginx, WebSocket upgrade requires:
  - An `http` level map to correctly handle the hop-by-hop `Connection` header:
    ```nginx
    map $http_upgrade $connection_upgrade {
        default upgrade;
        '' close;
    }
    ```
  - Proxy directives inside `location /`:
    ```nginx
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    ```
  - Using `$connection_upgrade` ensures regular HTTP requests maintain standard keep-alive connection semantics, whereas WebSocket requests get `Connection: upgrade`.

### 2.3 Static Asset Caching for `/assets/` and `/mc-icons/`
- **Premise**: Vite generates content-hashed filenames in `/assets/` (e.g. `index-Bbf163Rx.js`), and `/mc-icons/` contains immutable Minecraft item PNG textures.
- **Premise**: R2 requires: `Cache-Control: public, max-age=31536000, immutable`.
- **Inference**:
  - `location /assets/` and `location /mc-icons/` can either be served directly from disk if files are mounted at `/var/www/twnetwork-site/dist` (the standard PM2 bare-metal setup) or proxied to Node (`proxy_pass http://127.0.0.1:3000;`).
  - By configuring `root /var/www/twnetwork-site/dist;` with `try_files $uri @proxy;` (or proxy pass with `add_header Cache-Control "public, max-age=31536000, immutable" always;`), Nginx handles static file delivery with near-zero latency, avoiding Node event-loop blocking.
  - Adding `expires 1y;` and `add_header Cache-Control "public, max-age=31536000, immutable";` directly meets the requirement.

### 2.4 Gzip and Brotli Compression
- **Premise**: Frontend assets include large JS (~786KB), CSS (~138KB), SVG icons, and JSON API payloads.
- **Inference**:
  - Nginx `gzip` should be activated with `gzip_vary on;`, `gzip_proxied any;`, `gzip_comp_level 6;`, `gzip_min_length 256;`.
  - Compression MIME types must cover:
    - HTML (`text/html` is compressed by default in Nginx; duplicate declaration in `gzip_types` produces a warning)
    - JavaScript (`application/javascript`, `text/javascript`)
    - CSS (`text/css`)
    - JSON (`application/json`)
    - SVG (`image/svg+xml`)
    - XML and plain text (`text/plain`, `text/xml`, `application/xml`)
    - Web fonts (`application/vnd.ms-fontobject`, `application/x-font-ttf`, `font/opentype`)
  - Brotli requires the dynamic/compiled module `ngx_brotli`. If compiled, `brotli on;` directives can be enabled. In the template, we provide active Gzip and a commented, ready-to-enable Brotli block with clear installation instructions so `nginx -t` will not fail on standard Nginx builds that lack `ngx_brotli`.

### 2.5 Hidden File Blocking & ACME Challenge Precedence
- **Premise**: R2 mandates blocking hidden files via `location ~ /\. { deny all; }`.
- **Premise**: Certbot/Let's Encrypt uses `/.well-known/acme-challenge/<token>` to issue and renew SSL certificates via HTTP-01 challenge.
- **Inference**:
  - Because `/.well-known` starts with a dot (`.` followed by `well-known`), standard Nginx regex matching `location ~ /\. { deny all; }` would MATCH and BLOCK ACME challenges, causing Certbot renewal failures.
  - Fix: An explicit `location ^~ /.well-known/acme-challenge/ { allow all; root /var/www/certbot; }` with the `^~` modifier must be placed BEFORE or alongside the hidden file block. In Nginx matching precedence, `^~` halts regex searching, allowing ACME tokens to be served while all other dotfiles (`.env`, `.git`, `.gitignore`, `.oxlintrc.json`) are blocked with HTTP 403.

### 2.6 SSL and Port 80 Redirect
- **Premise**: R2 requires port 80 and 443 with SSL placeholders.
- **Inference**:
  - Port 80 block handles ACME challenges and issues a `301 Moved Permanently` redirect to `https://$host$request_uri`.
  - Port 443 block configures `ssl_certificate` and `ssl_certificate_key` placeholders pointing to `/etc/letsencrypt/live/twnetwork.com.br/fullchain.pem` and `privkey.pem`.
  - TLS 1.2 and 1.3 are specified with secure cipher suites, session cache, and modern SSL options.

---

## 3. Caveats

1. **Brotli Module Availability**:
   - The standard `nginx` package in Ubuntu/Debian official repos does not include `ngx_brotli` by default. Enabling `brotli on;` without `load_module modules/ngx_http_brotli_filter_module.so;` causes Nginx syntax validation (`nginx -t`) to fail with `unknown directive "brotli"`.
   - The template provides `gzip` fully enabled and `brotli` structured with an explanatory comment block ready for servers where `ngx_brotli` is compiled.
2. **Static Asset Root Path**:
   - In bare-metal PM2 deployments, static files reside on the host filesystem (e.g. `/var/www/twnetwork-site/dist`).
   - If deploying via Docker where only port 3000 is exposed to the host, Nginx acts purely as a reverse proxy forwarding `/assets/` and `/mc-icons/` to `http://127.0.0.1:3000`, while still injecting the `Cache-Control` header. The template documents both setups.
3. **CORS and Host Header Matching**:
   - `server.ts` uses `cors({ origin: isProduction ? allowedOrigins : true })`. If Nginx does not pass `proxy_set_header Host $host;`, or if users connect through an unlisted domain, CORS will reject cross-origin API calls. The `ALLOWED_ORIGINS` variable in `.env` must match the `server_name` configured in `twnetwork.conf`.
4. **Express Rate Limit Trust Proxy Count**:
   - `server.ts` uses `app.set('trust proxy', 1);`. If Cloudflare or an additional load balancer sits in front of Nginx, `trust proxy` in `server.ts` may need to be adjusted (e.g. `app.set('trust proxy', 2)` or specific CIDRs) to avoid spoofed client IPs.

---

## 4. Conclusion & Proposed Configuration

### 4.1 Specification of `twnetwork.conf`
The recommended file `twnetwork.conf` should be structured as follows:

```nginx
# ==============================================================================
# Nginx VirtualHost Configuration — TW Network
# Project: twnetwork-site (Full-Stack React + Express + PostgreSQL)
# File: /etc/nginx/sites-available/twnetwork.conf (or /etc/nginx/conf.d/twnetwork.conf)
# ==============================================================================

# 1. Connection Upgrade Mapping for WebSocket Support
# Required for WebSocket / HMR / future real-time duplex connections
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

# 2. HTTP Server — Port 80
# Handles ACME challenge for Certbot and redirects all other traffic to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name twnetwork.com.br www.twnetwork.com.br;

    # ACME Challenge for Let's Encrypt / Certbot renewal
    # ^~ ensures this prefix takes priority over the hidden file regex denial below
    location ^~ /.well-known/acme-challenge/ {
        root /var/www/certbot;
        allow all;
    }

    # Block access to hidden files/directories on port 80
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Redirect all HTTP requests to HTTPS with 301 Permanent Redirect
    location / {
        return 301 https://$host$request_uri;
    }
}

# 3. HTTPS Server — Port 443
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name twnetwork.com.br www.twnetwork.com.br;

    # Root directory for static production build (Vite output: dist/)
    root /var/www/twnetwork-site/dist;
    index index.html;

    # --------------------------------------------------------------------------
    # SSL / TLS Configuration (Certbot / Let's Encrypt Placeholders)
    # --------------------------------------------------------------------------
    ssl_certificate /etc/letsencrypt/live/twnetwork.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/twnetwork.com.br/privkey.pem;
    # ssl_trusted_certificate /etc/letsencrypt/live/twnetwork.com.br/chain.pem;

    # Recommended TLS Protocols and Ciphers (Mozilla Intermediate Configuration)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;

    # OCSP Stapling (uncomment once certificates are issued)
    # ssl_stapling on;
    # ssl_stapling_verify on;
    # resolver 8.8.8.8 1.1.1.1 valid=300s;
    # resolver_timeout 5s;

    # --------------------------------------------------------------------------
    # Compression: Gzip & Brotli
    # --------------------------------------------------------------------------
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/x-javascript
        application/xml
        application/xml+rss
        application/vnd.ms-fontobject
        application/x-font-ttf
        font/opentype
        image/svg+xml
        image/x-icon;

    # Brotli Compression (enable if ngx_brotli module is installed)
    # brotli on;
    # brotli_comp_level 6;
    # brotli_types
    #     text/plain
    #     text/css
    #     text/xml
    #     text/javascript
    #     application/json
    #     application/javascript
    #     application/x-javascript
    #     application/xml
    #     application/xml+rss
    #     image/svg+xml;

    # --------------------------------------------------------------------------
    # Security & Limits
    # --------------------------------------------------------------------------
    client_max_body_size 20M;
    server_tokens off;

    # --------------------------------------------------------------------------
    # Security: Block Hidden Files & Directories (.env, .git, etc.)
    # --------------------------------------------------------------------------
    # Allow ACME challenge first
    location ^~ /.well-known/acme-challenge/ {
        root /var/www/certbot;
        allow all;
    }

    # Deny all files starting with a dot
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # --------------------------------------------------------------------------
    # Static Assets Caching: /assets/ (Vite Hashed Bundles)
    # --------------------------------------------------------------------------
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
        try_files $uri @proxy;
    }

    # --------------------------------------------------------------------------
    # Static Assets Caching: /mc-icons/ (Minecraft Item Textures)
    # --------------------------------------------------------------------------
    location /mc-icons/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
        try_files $uri @proxy;
    }

    # --------------------------------------------------------------------------
    # Root Static Files (favicon.svg, icons.svg)
    # --------------------------------------------------------------------------
    location ~* \.(ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        access_log off;
        try_files $uri @proxy;
    }

    # --------------------------------------------------------------------------
    # Reverse Proxy: Application Backend & SPA Routing (Node.js on 127.0.0.1:3000)
    # --------------------------------------------------------------------------
    location / {
        try_files $uri @proxy;
    }

    location @proxy {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;

        # Standard Proxy Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;

        # Timeouts and Buffering
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        proxy_buffering on;
        proxy_buffers 8 16k;
        proxy_buffer_size 16k;
    }
}
```

---

## 5. Verification Method

To independently verify the Nginx VirtualHost template and server integration:

1. **Nginx Configuration Syntax Test**:
   - On a Linux system with Nginx installed:
     ```bash
     nginx -t -c /path/to/twnetwork.conf
     ```
   - In containerized validation:
     ```bash
     docker run --rm -v $(pwd)/twnetwork.conf:/etc/nginx/conf.d/twnetwork.conf:ro nginx:alpine nginx -t
     ```
     *(Note: If testing without SSL certificates present, test the HTTP block or mock dummy certs: `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /tmp/privkey.pem -out /tmp/fullchain.pem -subj "/CN=twnetwork.com.br"`).*
2. **Static Asset Caching Verification**:
   - Inspect response headers for `/assets/` and `/mc-icons/`:
     ```bash
     curl -I https://twnetwork.com.br/assets/index-Bbf163Rx.js
     curl -I https://twnetwork.com.br/mc-icons/diamond.png
     ```
   - Expected header: `Cache-Control: public, max-age=31536000, immutable`.
3. **Hidden File Access Denial**:
   - Attempt to access sensitive dotfiles:
     ```bash
     curl -I https://twnetwork.com.br/.env
     curl -I https://twnetwork.com.br/.git/config
     ```
   - Expected status: `HTTP/1.1 403 Forbidden`.
4. **ACME Challenge Exception**:
   - Verify access to ACME challenge directory:
     ```bash
     curl -I http://twnetwork.com.br/.well-known/acme-challenge/test
     ```
   - Expected status: Not 403 (typically 404 or 200 depending on test file presence).
5. **WebSocket Upgrade & Proxy Headers**:
   - Verify proxy headers reach Express: check `req.ip` in `server.ts` logs or test with WebSocket client handshake sending `Connection: Upgrade` and `Upgrade: websocket`.
6. **Project Lint and Build**:
   - Verify existing codebase stays healthy:
     ```bash
     npm run lint
     npm run build
     ```
   - Both commands must finish with exit code 0.
