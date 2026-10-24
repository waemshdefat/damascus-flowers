#!/usr/bin/env bash
set -euo pipefail

# Damascus Flowers | أزهار دمشق — Automated PostgreSQL + Media Backup Script
BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

if [ -z "${DATABASE_URL:-}" ] && [ -f .env ]; then
  export $(grep -E '^DATABASE_URL=' .env | xargs)
fi

echo "1) Creating compressed PostgreSQL dump..."
pg_dump "$DATABASE_URL" --no-owner --no-privileges | gzip > "$BACKUP_DIR/db-$TIMESTAMP.sql.gz"

echo "2) Archiving uploaded media files..."
tar -czf "$BACKUP_DIR/media-$TIMESTAMP.tar.gz" public/images

# Retain last 14 daily backups automatically
ls -1t "$BACKUP_DIR"/db-*.sql.gz 2>/dev/null | tail -n +15 | xargs -r rm -f
ls -1t "$BACKUP_DIR"/media-*.tar.gz 2>/dev/null | tail -n +15 | xargs -r rm -f

echo "Backup completed successfully:"
echo "  Database : $BACKUP_DIR/db-$TIMESTAMP.sql.gz"
echo "  Media    : $BACKUP_DIR/media-$TIMESTAMP.tar.gz"
