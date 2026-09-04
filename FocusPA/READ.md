# FocusPA

**Your personal productivity assistant for student life.**

Offline-first web app that brings tasks, deadlines, study focus, and expenses into one clean dashboard — built for students.

![FocusPA Dashboard](screenshots/01-dashboard.png)

---

## Features

| Module | What you get |
|--------|----------------|
| **Dashboard** | Good morning/evening greeting, top 3 focus tasks, next deadline countdown, study progress, budget snapshot |
| **Tasks** | Natural-language add, priorities, projects, tags, Today / Upcoming / Overdue / Focus views |
| **Events** | Exams, assignments, college & personal events with countdowns |
| **Study Timer** | Pomodoro (25/5, 45/10, 50/10), link sessions to tasks, streaks & history |
| **Expenses** | INR tracking, category budgets with progress bars, monthly view, CSV export |
| **Sync** | Auto-save in browser · Save/Load JSON · Auto-sync to a file (Chrome/Edge on PC) |

### Extra
- Exam Mode toggle  
- Quick add (`Ctrl+Shift+A`)  
- Works offline (PWA)  
- Phone + PC  

---

## Screenshots

<p align="center">
  <img src="screenshots/01-dashboard.png" width="48%" />
  <img src="screenshots/03-timer.png" width="48%" />
</p>
<p align="center">
  <img src="screenshots/02-tasks.png" width="48%" />
  <img src="screenshots/04-expenses.png" width="48%" />
</p>
<p align="center">
  <img src="screenshots/06-mobile-dashboard.png" width="30%" />
</p>

---

## Demo video

See [`demo/FocusPA-demo.mp4`](demo/FocusPA-demo.mp4) for a quick walkthrough of the main screens.

---

## How to run

### Option 1 – Open directly
Open `index.html` in Chrome, Edge, or Firefox.

### Option 2 – Local server (recommended for PWA)
```bash
python -m http.server 8080
# or
npx serve .
```
Then open http://localhost:8080

On phone (same Wi-Fi): `http://YOUR-PC-IP:8080` → **Add to Home Screen**.

---

## Data & sync

- **Same device:** everything auto-saves in the browser (`localStorage`).
- **PC ↔ Phone:** use **Save** / **Load** (JSON backup).
- **PC auto file sync:** click **Auto-sync** (Chrome/Edge) and pick a file in Google Drive / OneDrive so changes write to that file automatically.

---

## Project structure

```
focuspa/
├── index.html
├── css/styles.css
├── js/
│   ├── storage.js      # localStorage + optional file sync
│   ├── utils.js
│   ├── tasks.js
│   ├── events.js
│   ├── timer.js
│   ├── expenses.js
│   ├── dashboard.js
│   └── app.js
├── icons/
├── screenshots/
├── demo/
├── manifest.json
├── sw.js
└── README.md
```

---

## Tech

- Pure HTML + CSS + Vanilla JS  
- No build step, no frameworks  
- Offline-first PWA  

---

## Roadmap

- [ ] Subtasks inside tasks  
- [ ] Recurring tasks & expenses  
- [ ] Richer month calendar  
- [ ] Focus mode / ambient sounds  
- [ ] Optional cloud sync  

---

Built for students who want one calm place for deadlines, study time, and money.

**FocusPA** — study smarter, spend wiser, stay on track.
