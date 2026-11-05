/**
 * ==============================================================================
 * PM2 Process Manager Configuration — TW Network
 * Project: twnetwork-site (Full-Stack React + Express + PostgreSQL)
 * File: ecosystem.config.cjs
 *
 * Usage:
 *   pm2 start ecosystem.config.cjs --env production
 *   pm2 restart ecosystem.config.cjs --env production
 *   pm2 reload ecosystem.config.cjs --env production
 *   pm2 logs twnetwork-site
 *   pm2 status
 * ==============================================================================
 */

module.exports = {
  apps: [
    {
      name: 'twnetwork-site',

      // Execution target: server.ts powered by Node.js ESM + tsx loader
      script: 'server.ts',
      interpreter: 'node',
      node_args: '--import tsx',

      // Application execution directory
      cwd: './',

      // Auto-restart on unexpected crashes
      autorestart: true,

      // Restart application if memory consumption exceeds 500 MB
      max_memory_restart: '500M',

      // Disable file watching in production to conserve system resources
      watch: false,

      // Logging configuration
      time: true,
      error_file: './logs/pm2-err.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true,

      // Default environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // Explicit production environment flag (--env production)
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
