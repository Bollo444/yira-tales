# Yira Tales

**Tagline:** “Your Instant Storyteller”

**Category:** Real-time Generative Storytelling

## Overview

Yira Tales is an AI-powered platform designed for users to create real-time, high-quality, interactive stories. Users can leverage custom prompts, genres, tones, and characters to generate unique narratives. This project aims to deliver an intuitive and engaging storytelling experience.

## MVP Features

- Real-time streaming story generation using OpenAI API
- Input controls for genre, tone, POV, character, and setting
- Dialogue and pacing sliders
- Co-authoring mode where the user and AI take turns writing
- Export stories to PDF and TXT formats
- Stories saved to browser's localStorage (no login required for MVP)

## Tech Stack

- **Frontend:** React, Zustand, TailwindCSS
- **Backend:** Node.js, Express
- **AI Layer:** OpenAI GPT-4 API
- **Storage (MVP):** IndexedDB/localStorage
- **Hosting:** Vercel (Frontend), Render/Railway (Backend)

## Project Structure

```
yira-tales/
├── .vscode/
│   └── settings.json
├── backend/            # Node.js, Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js      # Express app setup
│   ├── package.json
│   └── .env.example
├── frontend/           # React, Zustand, TailwindCSS frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/      # Zustand store
│   │   ├── styles/
│   │   ├── utils/
│   │   └── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── todo.md             # Development task tracking
└── README.md           # This file
```

## Getting Started

Detailed setup instructions will be added as the project progresses.

### Prerequisites

- Node.js (version specified in `.nvmrc` or latest LTS)
- npm or yarn
- Git

### Backend Setup (Placeholder)

```bash
cd backend
npm install
# cp .env.example .env (and fill in your OpenAI API key)
npm run dev
```

### Frontend Setup (Placeholder)

```bash
cd frontend
npm install
npm run dev
```

## Development Plan

Refer to `todo.md` for a detailed breakdown of development tasks and phases.

## Milestones (from PRD)

| Timeline   | Milestone               |
|------------|--------------------------|
| May 2025   | MVP Specification Finalized |
| June 2025  | Beta Version Ready       |
| July 2025  | Public Launch            |

---

*This README is a living document and will be updated as the project evolves.*