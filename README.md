# Darji Content Planner

A Vite + React content planner for scheduling and tracking social media posts.

## Setup

Install dependencies:

```bash
npm install
```

Copy the example environment file:

```bash
cp .env.example .env
```

Add your Google OAuth client ID:

```env
VITE_GOOGLE_CLIENT_ID=your-google-oauth-web-client-id.apps.googleusercontent.com
```

## Google OAuth Credentials

When creating a Google OAuth web client, use these values for local development.

Authorized JavaScript origins:

```text
http://127.0.0.1:5173
http://localhost:5173
```

Authorized redirect URIs:

```text
http://127.0.0.1:5173/
http://localhost:5173/
```

The app uses Google Identity Services in the browser, so the JavaScript origins are the required part for the sign-in button.

## Development

Start the dev server:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:5173/
```

## Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```
