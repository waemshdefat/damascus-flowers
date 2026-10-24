# Damascus Flowers — Production package

Contents: full Next.js 16 project (src, public with 60 product photos, db schema), Dockerfile,
docker-compose.yml (app + PostgreSQL 16 + Caddy auto-HTTPS), Caddyfile, scripts, catalog backup.

Quick start on a VPS (Ubuntu 22.04/24.04):
  1) unzip damascus-flowers-production.zip -d /opt/damascus-flowers && cd /opt/damascus-flowers
  2) cp .env.example .env && nano .env        # set DB password, ADMIN_SESSION_SECRET, ADMIN_PASSWORD
  3) bash scripts/deploy.sh                   # installs Docker, builds, starts, applies DB schema
  4) docker compose exec -T app node node_modules/tsx/dist/cli.mjs scripts/restore-backup.ts backups/damascus-flowers-catalog-export.json
  5) Point DNS A record of damascusflowers.com to the server IP → HTTPS is issued automatically.

Full Arabic guide: DEPLOYMENT_AND_MIGRATION_AR.md
