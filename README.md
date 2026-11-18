# Schedule Shifter — Trello Power-Up

**Schedule Shifter** is a complete Trello Power-Up that allows teams to shift start and due dates of multiple Trello cards in bulk by a fixed number of days forward or backward.

![Schedule Shifter](https://p.trellocdn.com/favicon.ico)

---

## ✨ Features Implemented (Matching Design Screenshots)

1. **Welcome / Hero Screen (Image 1)**
   - Custom calendar shift illustration with sparkles and curved transfer arrow
   - Value propositions: *Select multiple cards*, *Shift dates forward or backward*, *Preview and apply changes*
   - Direct CTA to start bulk rescheduling

2. **Step 1: Select Cards (Image 2)**
   - List filter dropdown (`All Lists`, `To Do`, `In Progress`, etc.)
   - Real-time search query filter (`Search cards...`)
   - Interactive table with select-all, individual row checkboxes, start dates, and due dates

3. **Step 2: Set Shift (Image 3)**
   - Direction selection: **Shift Forward →** (push dates later) or **Shift Backward ←** (bring dates earlier)
   - Days stepper control with `[-] [ 5 ] [+]` and live badge
   - Target date selection: Start Date, Due Date, or both
   - Live sidebar summary card reflecting selections in real-time

4. **Step 3: Preview Changes (Image 4)**
   - Summary badge bar (Cards count, direction, days, targets)
   - Side-by-side diff table: Current Date $\rightarrow$ [New Date Badge]
   - Safe verification before committing changes

5. **Step 4: Live Execution & All 3 Outcomes**
   - **Live Progress Animation (Image 5)**: Rotating calendar sync graphic, dynamic progress bar, and card-by-card status list (`Updated` / `Updating...`)
   - **Full Success State (Image 7)**: Green checkmark graphic, 3-metric summary badge, *Shift More Cards* and *View Updated Cards*
   - **Partial Issues State (Image 6)**: Yellow warning graphic, failure counts, tabbed filters (`Updated` vs `Not Updated`), error details (`No start or due date found`)
   - **Error / No Cards Updated State (Image 8)**: Red error graphic, troubleshooting checklist, *Go Back & Review* and *Try Again*

6. **Interactive Dev / Simulation Bar**
   - Switch between **Success**, **Partial Issues**, and **Error** simulation modes instantly to test every UX state
   - One-click flow reset
   - Trello credentials setup modal for testing live REST API outside Trello

---

## 🚀 Running Locally

Start the Vite development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

---

## 🔌 Connecting to Trello as a Power-Up

1. Go to the [Trello Power-Up Admin Portal](https://trello.com/power-ups/admin).
2. Click **New Power-Up**.
3. Name your Power-Up: **Schedule Shifter**.
4. Set the **Iframe connector URL** to your hosted `connector.html` (e.g. `https://<your-domain>/connector.html`).
5. In **Capabilities**, enable:
   - `Board Buttons`
   - `Card Buttons`
6. Save and add the Power-Up to any of your Trello boards!
