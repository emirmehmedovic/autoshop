# AutoShop - VPS Deployment Guide (Hetzner)

Ovaj dokument opisuje korake za deployment AutoShop aplikacije na Hetzner VPS serveru.

## Preduvjeti

- Ubuntu 22.04 LTS ili noviji
- Root ili sudo pristup
- Domen (opciono, ali preporučeno)
- PostgreSQL baza podataka

## 1. Priprema VPS Servera

### Ažuriranje sistema
```bash
sudo apt update && sudo apt upgrade -y
```

### Instalacija Node.js (v20.x)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Instalacija PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Kreiranje baze podataka
```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE autoshop;
CREATE USER autoshop_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE autoshop TO autoshop_user;
\q
```

### Instalacija PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### Instalacija Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 2. Deployment Aplikacije

### Kloniranje repositorija
```bash
cd /var/www
sudo git clone https://github.com/emirmehmedovic/autoshop.git
cd autoshop
sudo chown -R $USER:$USER /var/www/autoshop
```

### Instalacija dependencija
```bash
npm install
```

### Konfiguracija environment varijabli
```bash
cp .env.example .env
nano .env
```

Uredi `.env` fajl sa production vrijednostima:
```env
# Database
DATABASE_URL="postgresql://autoshop_user:your_secure_password@localhost:5432/autoshop"

# Auth
NEXTAUTH_SECRET="generisi_random_string_ovdje"
NEXTAUTH_URL="https://tvoj-domen.ba"

# Email (opciono)
RESEND_API_KEY="re_..."
ADMIN_EMAIL="admin@tvoj-domen.ba"

# Telegram notifikacije (opciono)
TELEGRAM_BOT_TOKEN="123456:ABC-DEF..."
TELEGRAM_CHAT_ID="123456789"

# Analytics (opciono)
NEXT_PUBLIC_META_PIXEL_ID="123456789"
NEXT_PUBLIC_CLARITY_ID="abcdefgh"
```

### Generisanje NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

### Primjena Prisma migracija
```bash
npx prisma generate
npx prisma db push
```

### Seed baze podataka (opciono)
```bash
npm run db:seed
```

### Build aplikacije
```bash
npm run build
```

## 3. Konfiguracija PM2

### Kreiranje PM2 config fajla
```bash
nano ecosystem.config.js
```

Dodaj sljedeći sadržaj:
```javascript
module.exports = {
  apps: [{
    name: 'autoshop',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/autoshop',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

### Pokretanje aplikacije
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 4. Konfiguracija Nginx

### Kreiranje Nginx config fajla
```bash
sudo nano /etc/nginx/sites-available/autoshop
```

Dodaj sljedeći sadržaj:
```nginx
server {
    listen 80;
    server_name tvoj-domen.ba www.tvoj-domen.ba;

    # Static files
    location /_next/static {
        alias /var/www/autoshop/.next/static;
        expires 365d;
        access_log off;
    }

    location /images {
        alias /var/www/autoshop/public/images;
        expires 30d;
        access_log off;
    }

    location /placeholder-product.svg {
        alias /var/www/autoshop/public/placeholder-product.svg;
        expires 30d;
        access_log off;
    }

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 10M;
}
```

### Aktiviranje konfiguracije
```bash
sudo ln -s /etc/nginx/sites-available/autoshop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 5. SSL Certifikat (Let's Encrypt)

### Instalacija Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Generisanje SSL certifikata
```bash
sudo certbot --nginx -d tvoj-domen.ba -d www.tvoj-domen.ba
```

## 6. Firewall Konfiguracija

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 7. Permisije za Upload Direktorij

```bash
sudo chown -R www-data:www-data /var/www/autoshop/public/images
sudo chmod -R 755 /var/www/autoshop/public/images
```

## 8. Automatski Deployment (opciono)

### Setup Git hooks za automatski pull
```bash
cd /var/www/autoshop
nano deploy.sh
```

```bash
#!/bin/bash
cd /var/www/autoshop
git pull origin main
npm install
npm run build
npx prisma generate
npx prisma db push
pm2 restart autoshop
```

```bash
chmod +x deploy.sh
```

## 9. Backup Baze Podataka

### Kreiranje backup script-a
```bash
nano /var/www/autoshop/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/autoshop"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -U autoshop_user autoshop > $BACKUP_DIR/autoshop_$DATE.sql
find $BACKUP_DIR -name "autoshop_*.sql" -mtime +7 -delete
```

```bash
chmod +x /var/www/autoshop/backup-db.sh
```

### Dodavanje cron job-a za dnevni backup
```bash
sudo crontab -e
```

Dodaj:
```
0 2 * * * /var/www/autoshop/backup-db.sh
```

## 10. Monitoring

### Praćenje aplikacije
```bash
pm2 logs autoshop
pm2 monit
```

### Nginx logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 11. Update Aplikacije

```bash
cd /var/www/autoshop
git pull origin main
npm install
npm run build
pm2 restart autoshop
```

## Dodatne Napomene

### Lokalno Skladištenje Slika
- Sve slike se čuvaju u `public/images/` direktoriju
- Nginx direktno servuje static files za bolje performanse
- Osiguraj redovne backups direktorija `/var/www/autoshop/public/images`

### Performance Optimizacije
- Razmotri korištenje Redis-a za session storage
- Konfiguriši Nginx caching za static assets
- Optimizuj slike prije uploada (WebP format preporučen)

### Sigurnost
- Promijeni default PostgreSQL port ako je potrebno
- Konfiguriši fail2ban za zaštitu od brute force napada
- Redovno ažuriraj sistem i dependencije
- Koristi jake lozinke za sve servise

## Hetzner Specifično

### Server Specifikacije (Preporučeno)
- Minimum: CPX21 (3 vCPU, 4 GB RAM, 80 GB SSD)
- Optimalno: CPX31 (4 vCPU, 8 GB RAM, 160 GB SSD)

### Backup Strategija
- Koristi Hetzner Backup service za automatske snapshots servera
- Dodatno čuvaj backups baze podataka lokalno

### Network
- Konfiguriši Hetzner Cloud Firewall za dodatnu sigurnost
- Razmotri korištenje Floating IP za lakšu migraciju
