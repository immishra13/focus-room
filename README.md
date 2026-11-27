# Focus Room — Focus Better, Together

Virtual study rooms with group pomodoro timers. Create a room, join with other students, run a shared focus cycle, and track your sessions.

> "Focus Better, Together." — the landing page hero. Join virtual study rooms, set group pomodoro timers, and track your focus sessions with students worldwide.

## What it does

- **Virtual study rooms** — create a room from the dashboard; anyone signed in can join it. Rooms live in Firestore and the list updates in real time.
- **Pomodoro timer** — 25-minute focus sessions with a 5-minute break, shown as a circular progress ring. The room stores its own timer length (`timerMinutes`, default 25).
- **Live presence** — joining a room adds you to its participant list and bumps the count; leaving removes you. The dashboard shows active rooms and how many people are online in each.
- **Session tracking** — when a focus session completes, a record goes into the `sessions` collection (user, room, 25 minutes, timestamp) and the user's `focusMinutes` and `sessionsCompleted` totals go up by one session.
- **Auth-gated app** — the dashboard and rooms are behind a protected route; sign-in is handled by Firebase Auth.

## How it works

```
Landing (/) -> Sign in (/auth) -> Dashboard (/dashboard) -> Room (/room/:id)
```

- `src/pages/LandingPage.jsx` — hero, features, and a mock room card.
- `src/pages/AuthPage.jsx` — Firebase sign-in / sign-up.
- `src/pages/Dashboard.jsx` — live room list (`onSnapshot` on the `rooms` collection), create-room form, active-room stats.
- `src/pages/FocusRoom.jsx` — room view: live room document, join/leave with `arrayUnion` / `arrayRemove` and a participant counter, timer, session-complete recording.
- `src/components/Timer.jsx` — pomodoro countdown (focus 25 min / break 5 min) with a progress ring and a Focus Session / Short Break badge.
- `src/components/RoomCard.jsx` — room card with name and online count.
- `src/components/ProtectedRoute.jsx` — redirects signed-out users to sign-in.
- `src/firebase/config.js` — Firebase app, Auth, and Firestore setup.

Firestore collections: `rooms` (name, createdBy, createdAt, participants, participantCount, timerMinutes), `sessions` (userId, roomId, roomName, sessionDuration, completedAt), `users` (uid, focusMinutes, sessionsCompleted).

## Stack

React 19 + Vite, Firebase (Auth + Firestore), React Router v7, Framer Motion, Lucide icons. Plain CSS, no UI framework.

## Run it

```bash
npm install
npm run dev
```

Add your Firebase web config in `src/firebase/config.js` first — the app needs a Firebase project with Auth and Firestore enabled.

## Honest notes

- Prototype, not a product: one initial commit (7 Apr 2026), no tests, no deployed URL verified yet.
- The timer runs on each client; the room only stores the timer length. Members start their own countdown when they enter the room.
- The hero stats on the landing page (student and minute counts) are placeholder copy, not real usage numbers.
