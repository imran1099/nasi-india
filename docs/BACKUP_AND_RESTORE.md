# NASI India — Database Backup & Restoration Guide

This document defines the operational procedures for backing up and restoring the PostgreSQL database and uploaded media assets for the NASI India platform.

---

## 1. Automated Daily Database Backup Script

Save this script as `/usr/local/bin/backup-nasi-db.sh` on the database server:

```bash
#!/usr/bin/env bash
set -eo pipefail

BACKUP_DIR="/var/backups/nasi-india/postgres"
DATE=$(date +"%Y%m%d_%H%M%S")
FILENAME="$BACKUP_DIR/nasi_india_$DATE.sql.gz"
RETENTION_DAYS=30

mkdir -p "$BACKUP_DIR"

# Perform compressed dump
pg_dump -U postgres -h localhost -d nasi_india --no-owner --clean --if-exists | gzip > "$FILENAME"

chmod 600 "$FILENAME"

echo "[$(date)] Backup completed: $FILENAME"

# Prune backups older than 30 days
find "$BACKUP_DIR" -type f -name "nasi_india_*.sql.gz" -mtime +$RETENTION_DAYS -delete
echo "[$(date)] Pruning completed for backups older than $RETENTION_DAYS days."
```

Make the script executable:
```bash
chmod +x /usr/local/bin/backup-nasi-db.sh
```

### Schedule Daily Cron at 02:00 AM IST
```cron
0 2 * * * /usr/local/bin/backup-nasi-db.sh >> /var/log/nasi-backup.log 2>&1
```

---

## 2. On-Demand Manual Backup

To generate an immediate manual backup prior to running migrations or maintenance:

```bash
# Compressed SQL dump
pg_dump -U postgres -h localhost -d nasi_india --no-owner --clean --if-exists | gzip > pre_migration_backup_$(date +"%Y%m%d_%H%M%S").sql.gz

# Custom format dump (allows parallel restore)
pg_dump -U postgres -h localhost -d nasi_india -F c -b -v -f nasi_india_custom_$(date +"%Y%m%d_%H%M%S").dump
```

---

## 3. Database Restoration Procedure

> [!CAUTION]
> Restoration will overwrite existing tables and data. Ensure you have taken a backup of the current state before executing a restore.

### Step 1: Terminate Active Connections
```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'nasi_india' AND pid <> pg_backend_pid();
```

### Step 2: Restore from Compressed SQL Dump
```bash
gunzip -c /var/backups/nasi-india/postgres/nasi_india_20261030_020000.sql.gz | psql -U postgres -h localhost -d nasi_india
```

### Step 3: Restore from Custom Format (`.dump`)
```bash
pg_restore -U postgres -h localhost -d nasi_india -v --clean --if-exists nasi_india_custom_20261030.dump
```

### Step 4: Verify Database Health & Integrity
Run the production readiness verification script to ensure all tables, records, and relationships are intact:
```bash
npx tsx scripts/verify-production-readiness.ts
```

---

## 4. Media Asset Backup & Synchronization

Uploaded media files (PDF newsletters, event photos, club coordinator photos) are located at `public/uploads/` (or stored in configured S3 object storage).

### Local Filesystem Backup
```bash
# Sync local uploads directory to secure backup volume
rsync -avz --delete /var/www/nasi-india/public/uploads/ /var/backups/nasi-india/media/
```

### S3 / Cloud Storage Backup (If configured)
```bash
aws s3 sync /var/www/nasi-india/public/uploads/ s3://nasi-india-backups/uploads/ --delete
```

