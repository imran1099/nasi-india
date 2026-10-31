# NASI India — Production Deployment Guide

This guide describes how to deploy the National Association of Soroptimist International of India (NASI India) website to production.

---

## 1. System Requirements & Architecture

- **Operating System**: Linux (Ubuntu 22.04 LTS or 24.04 LTS recommended)
- **Node.js**: v20.x or v22.x LTS
- **Package Manager**: `npm` (v10+)
- **Database**: PostgreSQL 15 or 16
- **Reverse Proxy**: Nginx with Let's Encrypt SSL/TLS
- **Process Manager**: PM2 or `systemd`

---

## 2. Environment Variables Configuration

Copy `.env.example` to `.env.production` on the production server.

```bash
cp .env.example .env.production
```

### Required Production Environment Variables

| Variable | Description | Example / Recommendations |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://nasi_admin:SECURE_PASSWORD@127.0.0.1:5432/nasi_india?schema=public` |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | 32-character hex encryption key | Generate using `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `SESSION_SECRET` | 32+ character HMAC secret for session cookies | Stable random string |
| `NEXT_PUBLIC_SITE_URL` | Canonical public site URL | `https://nasiindia.org` |
| `NODE_ENV` | Environment identifier | `production` |
| `CRON_SECRET` | Secret token to authorize publication cron triggers | Stable random token |
| `EMAIL_FROM` | Sender address for system notifications | `NASI India Secretariat <secretariat@nasiindia.org>` |
| `NOTIFICATIONS_EMAIL_TO` | Administrative inbox for enquiries | `secretariat@nasiindia.org` |
| `SMTP_HOST` | Production SMTP relay server | `smtp.sendgrid.net` or `smtp.eu.mailgun.org` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP username / API key identity | `apikey` |
| `SMTP_PASSWORD` | SMTP password / API secret key | `SG.xxxxxxxx...` |
| `RESEND_API_KEY` | Optional: Alternative Resend transactional API key | `re_xxxxxxxx...` |

---

## 3. Server Setup & Application Build

### Step 1: Clone Repository
```bash
git clone https://github.com/nasi-india/nasi-india-app.git /var/www/nasi-india
cd /var/www/nasi-india
```

### Step 2: Install Production Dependencies
```bash
npm ci --omit=dev
```

### Step 3: Run Database Migrations
```bash
npx prisma migrate deploy
```

### Step 4: Seed Baseline Club Records (Initial Setup Only)
```bash
npm run db:seed
```

### Step 5: Provision Initial Super Administrator
Provision the initial administrator with a secure password:
```bash
npm run admin:provision
```
> [!IMPORTANT]
> The provisioning script prompts for the administrator's email and a secure password. Passwords are never seeded into git repositories.

### Step 6: Build Next.js Production Bundle
```bash
npm run build
```

---

## 4. Process Management (PM2)

Create an `ecosystem.config.js` file in the project root:

```javascript
module.exports = {
  apps: [
    {
      name: "nasi-india-web",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
```

Start the application:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 5. Nginx Reverse Proxy Configuration

Create `/etc/nginx/sites-available/nasiindia.org`:

```nginx
server {
    server_name nasiindia.org www.nasiindia.org;

    client_max_body_size 30M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /uploads {
        alias /var/www/nasi-india/public/uploads;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
}
```

Enable site and acquire SSL/TLS certificate:
```bash
sudo ln -s /etc/nginx/sites-available/nasiindia.org /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d nasiindia.org -d www.nasiindia.org
```

---

## 6. Automated Scheduled Publication Cron

To automatically publish scheduled news articles and scheduled events, configure a system cron to hit the scheduler endpoint every 15 minutes:

```bash
crontab -e
```

Add the following line:
```cron
*/15 * * * * curl -X POST -H "Authorization: Bearer YOUR_CRON_SECRET" https://nasiindia.org/api/cron/publish > /dev/null 2>&1
```

