# دليل إعداد تطبيق متتبع المشاريع المحلي

يقدم هذا الدليل تعليمات مفصلة لتنصيب تطبيق **متتبع المشاريع المحلي** على جهازك. هذا الحل المُضيف ذاتيًا يعمل كليًا محليًا، مما يوفر الخصوصية والتحكم في بياناتك.

---

# Project Tracker App - Local Setup Guide

This guide provides detailed instructions for setting up the **local-first** Project Tracker App on your machine. This self-hosted solution runs entirely locally, providing privacy and control over your data.

## المتطلبات الأساسية

قبل أن تبدأ، تأكد من تثبيت ما يلي:

- **Node.js 18+**: [تحميل Node.js](https://nodejs.org/)
- **npm أو yarn**: متضمن مع تثبيت Node.js
- **Git**: [تحميل Git](https://git-scm.com/)

## خطوات التثبيت

### 1. نسخ المستودع

أولاً، نسخ مستودع المشروع إلى جهازك المحلي:

```bash
git clone <رابط-المستودع>
cd project-tracker-app
```

---

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js 18+**: [Download Node.js](https://nodejs.org/)
- **npm or yarn**: Included with Node.js installation
- **Git**: [Download Git](https://git-scm.com/)

## Installation Steps

### 1. Clone the Repository

First, clone the project repository to your local machine:

```bash
git clone <repository-url>
cd project-tracker-app
```

## Option 1: Dockerized PostgreSQL (Recommended)

This is the easiest method if you have Docker installed.

### 1. Install Docker Desktop (if not already installed)

- **Windows**: [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Mac**: [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Linux**: Follow instructions for your distribution

### 2. Start the Database

1. Open Docker Desktop
2. Navigate to the project directory:
   ```bash
   cd project-tracker-app
   ```
3. Start the PostgreSQL container:
   ```bash
   docker-compose up -d
   ```

### 3. Verify Database Connection

Check if the container is running:

```bash
docker ps
```

You should see a container named `project-tracker-app-db` running on port `5432`.

## Option 2: Local PostgreSQL Installation

If you prefer to install PostgreSQL locally:

### 1. Install PostgreSQL

- **Windows**: Download from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
- **Mac**: Use Homebrew:
  ```bash
  brew install postgresql
  ```
- **Linux**: Use your package manager:

  ```bash
  # Debian/Ubuntu
  sudo apt update
  sudo apt install postgresql postgresql-contrib

  # Red Hat/CentOS
  sudo yum install postgresql-server
  ```

### 2. Start PostgreSQL Service

- **Windows**: Start from Services or run:
  ```bash
  net start postgresql-x64-17
  ```
- **Mac**:
  ```bash
  brew services start postgresql
  ```
- **Linux**:
  ```bash
  sudo systemctl start postgresql
  ```

### 3. Create Database and User

1. Open the PostgreSQL command line:

   ```bash
   psql -U postgres
   ```

2. Create a database and user:

   ```sql
   -- Create database
   CREATE DATABASE "project-tracker";

   -- Create user (optional, can use postgres user)
   CREATE USER "project-tracker-user" WITH PASSWORD 'password123';

   -- Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE "project-tracker" TO "project-tracker-user";
   ```

## Note on Cloud Services

While this app is designed as a **local-first solution**, you can optionally use a cloud PostgreSQL service if you want to access your data from multiple devices:

- [Supabase](https://supabase.com/) (Free tier available)
- [Neon](https://neon.tech/) (Serverless PostgreSQL)
- [AWS RDS](https://aws.amazon.com/rds/postgresql/)
- [Google Cloud SQL](https://cloud.google.com/sql/postgresql)

**Warning**: Using a cloud service will store your data externally and may require internet connectivity.

## Configure Environment Variables

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your database connection information:

### For Docker Installation (Option 1):

```env
# Database configuration
DATABASE_URL="postgresql://postgres:password123@localhost:5432/project-tracker"

# Next.js configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3001"
```

### For Local Installation (Option 2):

```env
# Database configuration
DATABASE_URL="postgresql://project-tracker-user:password123@localhost:5432/project-tracker"

# Next.js configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3001"
```

### For Cloud Service (Option 3):

```env
# Database configuration
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>"

# Next.js configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3001"
```

## Install Dependencies

```bash
npm install
```

## Set Up the Database

### 1. Generate Migrations

```bash
npm run db:generate
```

### 2. Run Migrations

```bash
npm run db:migrate
```

### 3. Seed with Sample Data

```bash
npm run db:seed
```

## Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3001`

## Verify Installation

1. Open your browser and navigate to `http://localhost:3001`
2. You should see the dashboard with sample data
3. Try creating a new project or feature to test the functionality

## Troubleshooting

### Database Connection Issues

**Problem**: "Connection timed out" or "Connection refused"

**Solutions**:

1. Verify PostgreSQL is running
2. Check that the port number is correct (default: 5432)
3. Verify the database name, username, and password in `.env`
4. For Docker, check if the container is running:
   ```bash
   docker ps
   ```

### Migration Errors

**Problem**: "Migration failed" or "Table already exists"

**Solutions**:

1. Check if migrations have already been run
2. If starting fresh, reset the database:

   ```bash
   # For Docker
   docker-compose down -v
   docker-compose up -d
   npm run db:migrate
   npm run db:seed

   # For local installation
   # Drop and recreate the database
   ```

### Seed Data Issues

**Problem**: "Seed failed" or "No data in the database"

**Solutions**:

1. Verify the database connection
2. Check that migrations have been run
3. Run the seed script again:
   ```bash
   npm run db:seed
   ```

## Optional: Drizzle Studio

Drizzle Studio is a GUI for your database. To use it:

1. Start the development server
2. Run:
   ```bash
   npm run db:studio
   ```
3. Open the URL provided in your browser

## Next Steps

- Explore the [FEATURE_PREVIEW.md](FEATURE_PREVIEW.md) to learn about all available features
- Customize the application by modifying components in the `components/` directory
- Add new features by extending the database schema in `lib/db/schema.ts`

## Production Deployment

For production deployment:

1. Build the application:

   ```bash
   npm run build
   ```

2. Set up a production PostgreSQL database
3. Update the `.env` file with production connection details
4. Start the production server:
   ```bash
   npm run start
   ```

## Support

If you encounter any issues during setup, please check the [README.md](README.md) or open an issue on the GitHub repository.
