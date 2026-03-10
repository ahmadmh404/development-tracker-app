# تطبيق متتبع المشاريع

أداة متابعة تطوير حديثة ومتكاملة تعمل على أساس **محلي فقط** تم إنشاؤها باستخدام Next.js 16 و TypeScript و shadcn/ui. استبدل أدوات متابعة المشاريع عبر الإنترنت بهذا الحل المُضيف ذاتيًا الذي يعمل كليًا على جهازك المحلي.

---

# Project Tracker App

A modern, **local-first** development tracking tool built with Next.js 16, TypeScript, and shadcn/ui. Replace online project tracking tools with this self-hosted solution that runs entirely on your local machine.

## لماذا تختار هذا التطبيق؟

**بديل محلي تمامًا عن الأدوات عبر الإنترنت**

- لا رسوم اشتراك
- الخصوصية للبيانات - معلوماتك تبقى على جهازك
- لا يحتاج إلى اتصال بالإنترنت
- تحكم كامل على بياناتك
- مفتوح المصدر وقابل للتخصيص

---

## Why Choose This App?

**Local-First Alternative to Online Tools**

- No subscription fees
- Data privacy - your information stays on your machine
- No internet connection required
- Full control over your data
- Open source and customizable

## Features

### 📊 Dashboard

- Quick stats overview (active projects, total features, open tasks)
- Continue working on your latest project
- All projects grid view
- Project creation and management

### 🚀 Project Management

- Detailed project pages with features and decisions
- Status management (In Progress, Done, etc.)
- Tech stack visualization
- Editable project details

### ✨ Feature Tracking

- Feature detail pages with task boards
- Column-based task management (To Do / In Progress / Done)
- Task creation, editing, and status updates
- Effort estimation and due dates

### 🤔 Decision Logging

- Decision cards with pros/cons analysis
- Alternatives documentation
- Decision history and date tracking
- Edit and delete functionality

### 🔍 Search

- Debounced search for projects and features
- Search results with context
- Quick navigation from search

### 📱 Responsive Design

- Mobile-first approach
- Resizable panels on desktop
- Smooth animations and transitions
- Dark/light theme support

## Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS v4
- **Icons**: lucide-react
- **Forms**: React Hook Form
- **Validation**: Zod
- **Animations**: CSS transitions

### Backend

- **Runtime**: Node.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Caching**: Next.js built-in cache
- **Environment**: Docker

### Development

- **Build Tool**: Next.js
- **Linting**: ESLint
- **Package Manager**: npm
- **Git**: Version control

## كيفية البدء

### المتطلبات الأساسية

- Node.js 18+
- npm أو yarn
- PostgreSQL (تثبيت محلي أو Docker)
- Docker (اختياري، لقاعدة البيانات المُحايدة)

### التثبيت

1. **نسخالمستودع**:
   ```bash
   git clone <رابط-المستودع>
   cd project-tracker-app
   ```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (local installation or Docker)
- Docker (optional, for containerized database)

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd project-tracker-app
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up the database**:
   - See [SETUP.md](SETUP.md) for detailed database setup instructions

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to `http://localhost:3001`

## Available Scripts

### Development

```bash
npm run dev              # Start development server (port 3001)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Database

```bash
npm run db:generate      # Generate database migrations
npm run db:migrate       # Run migrations
npm run db:push          # Push schema to database (destructive)
npm run db:studio        # Open Drizzle Studio
npm run db:seed          # Seed database with sample data
```

## Project Structure

```
project-tracker-app/
├── app/                     # Next.js app directory
│   ├── actions/            # Server actions
│   ├── projects/           # Project-related routes
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── projects/          # Project components
│   ├── features/          # Feature components
│   ├── tasks/             # Task components
│   ├── decisions/         # Decision components
│   └── search/            # Search components
├── lib/                    # Utility functions
│   ├── db/                # Database configuration
│   ├── queries/           # Database query functions
│   ├── validations/       # Validation schemas
│   └── mockData.ts        # Demo data
├── .env                   # Environment variables
├── package.json           # Dependencies
└── docker-compose.yml     # Docker configuration
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database configuration
DATABASE_URL="postgresql://username:password@localhost:5432/project-tracker"

# Next.js configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3001"
```

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.
