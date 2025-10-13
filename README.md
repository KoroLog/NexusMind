# NexusMind: Content Recommendation System

NexusMind is a web platform designed to deliver personalized content recommendations. Users can browse articles, interact with them (by "liking" them), and receive suggestions based on their interaction patterns.

## Key Features

- **Article Viewing**: Browse a list of available articles.
- **User Interaction**: "Like" articles to record your preferences.
- **User Authentication**: Sign-up and login system for a personalized experience.
- **Recommendations (WIP)**: The system is designed to be extended with a recommendation engine that learns from user interactions.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Databases**:
  - **Firebase (Firestore)**: Stores user interactions (likes, views).
  - **Supabase**: Used for article data management and authentication.
- **Deployment**: [Vercel](https://vercel.com/)

## Project Structure

```
/src
├── /app
│   ├── /article/[id]   # Article detail page
│   ├── /auth           # Authentication pages
│   ├── layout.tsx      # Main layout
│   └── page.tsx        # Home page
├── /components         # Reusable React components
│   ├── ArticleCard.tsx
│   ├── InteractionButtons.tsx
│   └── Navbar.tsx
└── /lib                # Business logic and configuration
    ├── fetchers.ts     # Data fetching functions
    ├── firebase.ts     # Firebase client configuration
    ├── hooks.ts        # Custom hooks
    ├── interactions.ts # Logic for user interactions
    └── supabase.ts     # Supabase client configuration
```

## Getting Started

Follow these steps to set up the local development environment.

### 1. Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm

### 2. Clone the Repository

```bash
git clone <REPOSITORY_URL>
cd nexusmind
```

### 3. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root and add the following variables. You can get these values from your Firebase and Supabase dashboards.

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

The easiest way to deploy this application is using the [Vercel Platform](https://vercel.com/new). Vercel integrates directly with Next.js and simplifies the deployment process.

1.  Fork this repository.
2.  Create a new project on Vercel and import your repository.
3.  Set up the environment variables (the same ones as in `.env.local`) in your Vercel project dashboard.
4.  Vercel will automatically deploy the application.