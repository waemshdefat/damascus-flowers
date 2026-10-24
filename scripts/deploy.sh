#!/usr/bin/env bash
# Damascus Flowers — one-command deploy / update on a VPS (Ubuntu 22.04/24.04)
# Usage:  bash scripts/deploy.sh            (first time or update)
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v docker >/dev/null 2>&1; then
  echo "[1/5] Installing Docker..."
  curl -fsSL https://get.docker.com | sh
fi

if [ ! -f .env ]; then
  echo "ERROR: .env not found. Copy .env.example to .env and fill the values first."; exit 1
fi

echo "[2/5] Building & starting containers..."
docker compose up -d --build

echo "[3/5] Waiting for database..."
sleep 8

echo "[4/5] Applying database schema (drizzle-kit push)..."
docker compose exec -T app node node_modules/drizzle-kit/bin.cjs push --force

echo "[5/5] Warming up (this also seeds categories/products/settings on first run)..."
sleep 3
curl -fsS http://127.0.0.1/api/health -H "Host: damascusflowers.com" >/dev/null && echo "Health OK" || echo "Health check not ready yet — check: docker compose logs -f app"

echo "Done. Site: https://damascusflowers.com   Admin: https://damascusflowers.com/admin"
