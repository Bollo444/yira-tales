# Yira Tales - Development Plan (MVP)

This document outlines the tasks required to build the MVP for Yira Tales, based on the provided PRD and MVP specifications.

## Phase 1: Project Setup & Foundation

- [x] **Task 1: Initialize Project Structure**
  - [x] Create root project directory `yira-tales`
  - [x] Initialize Git repository
  - [x] Create `README.md` with project overview and setup instructions
  - [x] Create this `todo.md` for task tracking

- [x] **Task 2: Frontend Setup (React, Zustand, TailwindCSS)**
  - [x] Initialize React application (e.g., using Create React App or Vite)
  - [x] Install and configure Zustand for state management
  - [x] Install and configure TailwindCSS for styling
  - [x] Set up basic project structure (components, pages, services, utils)

- [x] **Task 3: Backend Setup (Node.js, Express)**
  - [x] Initialize Node.js project (`npm init`)
  - [x] Install Express.js and other necessary dependencies (e.g., `cors`, `dotenv`)
  - [x] Set up basic project structure (routes, controllers, services, models)
  - [x] Configure basic Express server

- [ ] **Task 4: AI Layer Setup (OpenAI GPT-4 API)**
  - [x] Install OpenAI SDK for Node.js
  - [x] Set up environment variables for API key management
  - [x] Create a basic service/module for interacting with the OpenAI API

## Phase 2: Core Feature Development - Backend

- [x] **Task 5: Story Generation Endpoint**
  - [x] Design API endpoint for real-time story generation (`/api/story/generate`)
  - [x] Implement logic to take user inputs (prompt, genre, tone, POV, character, setting)
  - [x] Integrate with OpenAI API to stream story content
  - [x] Handle streaming responses and error management

- [x] **Task 6: Input Controls Handling**
  - [x] Define data structures for input controls
  - [x] Ensure backend can process and validate these inputs for story generation

- [x] **Task 7: Co-authoring Logic (Backend Support)**
  - [x] Design API endpoint(s) to support co-authoring mode (e.g., submitting user turns, getting AI turns)
  - [x] Implement logic to manage turns between user and AI

- [x] **Task 8: Export Functionality (Backend Support)**
  - [x] Design API endpoint to prepare story data for export (`/api/story/export`)
  - [x] Implement logic to format story content for TXT
  - [x] Implement logic to format story content for PDF (consider libraries like `pdf-lib` or `jsPDF` on frontend if client-side generation is preferred for PDF)

## Phase 3: Core Feature Development - Frontend

- [x] **Task 9: Story Mode Selection UI**
  - [x] Implement UI for selecting story mode (Quick, Custom, Co-Author)

- [x] **Task 10: Input Controls Form UI**
  - [x] Implement UI form for genre, tone, POV, character, setting inputs
  - [x] Implement UI for dialogue and pacing sliders
  - [x] Connect form to state management (Zustand)

- [x] **Task 11: Real-time Story Streaming UI**
  - [x] Implement UI component to display story content as it streams from the backend
  - [x] Handle live updates and smooth rendering

- [x] **Task 12: Paragraph Editing/Regeneration UI**
  - [x] Implement UI to allow users to pause generation
  - [x] Implement UI to select a paragraph for editing or regeneration
  - [x] Implement functionality to send edit/regenerate requests to the backend

- [x] **Task 13: Co-authoring Interface**
  - [x] Implement UI for user to input their turn
  - [x] Display AI's turn and user's turn sequentially

- [x] **Task 14: Export Options UI**
  - [x] Implement UI buttons/options to export story to PDF and TXT
  - [x] Trigger backend (or client-side) export process

- [x] **Task 15: Frontend-Backend Integration**
  - [x] Connect frontend components to backend API endpoints for all features
  - [x] Handle API requests, responses, and errors

## Phase 4: Storage & Non-Functional Requirements

- [x] **Task 16: Local Storage Implementation**
  - [x] Implement saving current story progress/settings to IndexedDB or localStorage
  - [x] Implement loading saved state on app initialization

- [x] **Task 17: Latency Optimization**
  - [x] Profile and optimize for <3s first-word delay for story generation
  - [ ] Optimize streaming for <5s per 100 words delay
  - [x] Added logging to measure API call time

- [x] **Task 18: Accessibility (WCAG 2.1 AA)**
  - [x] Review and implement accessibility best practices throughout the UI
  - [ ] Test with accessibility tools
  - [x] Added ARIA attributes to StoryModeSelection component

## Phase 5: Testing

- [x] **Task 19: Frontend Unit & Integration Tests**
  - [x] Write unit tests for critical React components and Zustand stores
  - [ ] Write integration tests for user flows (story generation, editing, export)
  - [x] Installed testing dependencies
  - [x] Configured Jest

- [x] **Task 20: Backend Unit & Integration Tests**
  - [x] Write unit tests for Express controllers and services
  - [ ] Write integration tests for API endpoints
  - [x] Installed testing dependencies
  - [x] Configured Jest

- [x] **Task 21: End-to-End Testing**
  - [ ] Perform manual E2E testing of all core features
  - [x] (Optional) Set up automated E2E tests (e.g., using Cypress or Playwright)
  - [x] Installed Cypress

## Phase 6: Deployment

- [x] **Task 22: Frontend Deployment (Vercel)**
  - [x] Configure Vercel project for frontend deployment
  - [ ] Set up CI/CD pipeline
  - [x] Installed Vercel CLI
  - [x] Logged in to Vercel

- [ ] **Task 23: Backend Deployment (Render/Railway)**
  - [ ] Configure Render or Railway project for backend deployment
  - [ ] Set up CI/CD pipeline
  - [ ] Configure environment variables for production

- [ ] **Task 24: Pre-launch Checklist & Monitoring**
  - [ ] Final testing on staging/production environment
  - [ ] Set up basic logging and monitoring

## Phase 7: Documentation & Handoff

- [ ] **Task 25: Update README.md**
  - [ ] Add detailed setup, development, and deployment instructions

- [ ] **Task 26: (Optional) API Documentation**
  - [ ] Document backend API endpoints if necessary (e.g., using Swagger/OpenAPI)

## Success Metrics Tracking (Post-Launch)
- [ ] Implement analytics to track:
  - [ ] Story completion rate
  - [ ] Streaming delay
  - [ ] Weekly returning users
  - [ ] User feedback mechanisms (e.g., simple rating/survey)
  - [ ] Crash-free usage (error tracking tools like Sentry)

---
