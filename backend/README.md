# PostgreSQL / Supabase database setup

The Django backend connects to PostgreSQL directly through psycopg. No Supabase publishable, anon or service-role API key is needed for this connection. The frontend continues to call the Django API and must not contain database credentials.

## Local environment

Keep actual credentials in `backend/.env` (ignored by Git). The application reads these keys:

```dotenv
DATABASE_ENGINE=django.db.backends.postgresql
POSTGRES_HOST=db.YOUR_PROJECT_REF.supabase.co
POSTGRES_PORT=5432
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD='YOUR_DATABASE_PASSWORD'
POSTGRES_SSLMODE=require
POSTGRES_CONNECT_TIMEOUT=10
POSTGRES_CONN_MAX_AGE=60
```

Passwords are passed as separate driver parameters, so a literal `@` in `POSTGRES_PASSWORD` does not need URL encoding. This backend uses the `POSTGRES_*` variables rather than a `DATABASE_URL` string.

Local and production settings both pass `sslmode` and `connect_timeout` to psycopg, reuse connections for the configured lifetime, and enable connection health checks. Test settings retain the isolated in-memory SQLite database.

## Install and verify (Windows PowerShell)

Run from the backend directory:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe manage.py check
.\.venv\Scripts\python.exe scripts/check_db_connection.py
```

The connection checker runs read-only queries to confirm the database name, connected role and SSL status. It does not run migrations or modify data. It redacts the password from connection errors.

Changing `.env` requires restarting any already-running Django server.

## IPv4-only networks

Supabase direct database endpoints normally require IPv6 unless the project has an IPv4 add-on. If the direct host is unreachable from your network, open Supabase Dashboard > Connect > Session pooler, then copy the exact host, port and username to the corresponding `POSTGRES_*` variables. Keep SSL enabled. The session-pooler username differs from the direct username; do not construct or guess the pooler host from a region.

Reference: https://supabase.com/docs/guides/database/connecting-to-postgres

## Configured project

This workspace is configured through its ignored `backend/.env` to use the project's Session pooler:

- Host: `aws-0-ap-northeast-2.pooler.supabase.com`
- Port: `5432`
- Database: `postgres`
- Login: `postgres.rsexytpaiphcolffrkrv` (the pooler maps this login to the database role `postgres`)
- SSL: required and verified by the client connection checker

The password is stored only in `.env`.

Supabase's official agent skills were installed for Codex at project scope under `.agents/skills/`; `skills-lock.json` records their source.

## Migrations and demo data

Run from the backend directory, using the database configured in `.env`:

```powershell
.\.venv\Scripts\python.exe manage.py migrate --plan
.\.venv\Scripts\python.exe manage.py migrate --noinput
.\.venv\Scripts\python.exe manage.py seed_demo_data
.\.venv\Scripts\python.exe manage.py migrate --check
.\.venv\Scripts\python.exe scripts/verify_demo_data.py
```

Initial migrations cover all 13 business apps. The final `common` migration enables PostgreSQL RLS and revokes table privileges from `PUBLIC`, `anon` and `authenticated` for Django's tables, including auth, sessions, join tables and migration history. Django's database owner connection still works; authorization is handled by Django rather than Supabase Auth. New tables added by future migrations must receive the same protection. SQLite test databases skip the PostgreSQL-specific protection.

The configured Supabase project has 32 applied Django migrations and 54 Django tables, all with RLS enabled. The security advisor's informational `RLS Enabled No Policy` findings are intentional: these tables are accessed through Django, and neither Supabase API role has direct table privileges.

The seed creates 41 demo records: 4 categories, 4 plants, 4 variants, 4 product images, 4 monthly rental rates, 4 stock balances, 4 opening stock movements, 8 rental plant assets, 4 membership tiers and 1 homepage banner. Re-running it preserves existing records, prices, inventory and asset status. It creates no customer orders or user accounts. Create an administrator explicitly with `manage.py createsuperuser` when needed.

Images are copied from `frontend/public/images/home` into the configured Django media storage under `demo/home/`. Local media is ignored by Git and served by Django in development. With a different checkout layout, use `seed_demo_data --assets-dir PATH`. Production needs persistent media storage; image paths are stored in PostgreSQL, while image files use Django's configured storage.

The legacy `scripts/seed_dev_data.py` delegates to the same seed command and no longer creates an administrator with a hardcoded password.

`scripts/verify_demo_data.py` checks this four-product demo through Django's API views against the configured database, including the development media responses. It is read-only and intended for local settings after seeding.

Verify seed behavior against an isolated in-memory SQLite database:

```powershell
.\.venv\Scripts\python.exe manage.py test apps.common.tests --settings=config.settings.test
```
