const App = {
  currentView: 'dashboard',

  switchView(view) {
    this.currentView = view;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const viewEl = document.getElementById(`view-${view}`);
    const navBtn = document.querySelector(`.nav-btn[data-view="${view}"]`);
    if (viewEl) viewEl.classList.add('active');
    if (navBtn) navBtn.classList.add('active');

    const titles = {
      dashboard: ['Dashboard', 'Your day at a glance'],
      tasks: ['Tasks', 'Stay on top of everything'],
      events: ['Events', 'Deadlines & schedule'],
      timer: ['Study Timer', 'Focus sessions'],
      expenses: ['Expenses', 'Track spending']
    };
    const [title, sub] = titles[view] || ['Personal PA', ''];
    document.getElementById('view-title').textContent = title;
    document.getElementById('view-subtitle').textContent = sub;

    // Show personal greeting only on dashboard
    const greetBlock = document.getElementById('greeting-block');
    const titleBlock = document.getElementById('view-title-block');
    if (view === 'dashboard') {
      if (greetBlock) greetBlock.classList.remove('hidden');
      if (titleBlock) titleBlock.classList.add('hidden');
      this.updateGreeting();
    } else {
      if (greetBlock) greetBlock.classList.add('hidden');
      if (titleBlock) titleBlock.classList.remove('hidden');
    }

    // Refresh relevant views
    if (view === 'tasks') Tasks.render();
    if (view === 'events') Events.render();
    if (view === 'timer') {
      Timer.populateTaskSelect();
      Timer.renderStats();
      Timer.renderHistory();
    }
    if (view === 'expenses') Expenses.render();
    if (view === 'dashboard') Dashboard.refresh();
  },

  openQuickAdd(tab = 'task') {
    document.getElementById('modal-overlay').classList.remove('hidden');
    this.switchTab(tab);

    // Prefill dates
    document.getElementById('task-due').value = Utils.today();
    document.getElementById('exp-date').value = Utils.today();
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('event-start').value = now.toISOString().slice(0, 16);

    // Focus first input
    setTimeout(() => {
      const form = document.getElementById(`form-${tab}`);
      const input = form?.querySelector('input, select');
      input?.focus();
    }, 100);

    Timer.populateTaskSelect();
  },

  closeQuickAdd() {
    document.getElementById('modal-overlay').classList.add('hidden');
    // Reset forms
    document.getElementById('form-task').reset();
    document.getElementById('form-expense').reset();
    document.getElementById('form-event').reset();
    document.getElementById('form-session').reset();
  },

  switchTab(tab) {
    document.querySelectorAll('.modal-tabs .tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.modal-tabs .tab[data-tab="${tab}"]`)?.classList.add('active');
    document.querySelectorAll('.modal-form').forEach(f => f.classList.add('hidden'));
    document.getElementById(`form-${tab}`)?.classList.remove('hidden');
  },

  toggleExamMode() {
    const settings = Store.getSettings();
    settings.examMode = !settings.examMode;
    Store.saveSettings(settings);
    document.body.classList.toggle('exam-mode', settings.examMode);
    Utils.toast(settings.examMode ? 'Exam mode ON – stay focused!' : 'Exam mode off');
  },



  // ========== GREETING ==========
  messages: {
    morning: [
      "Let's make today productive.",
      "Time to crush those goals!",
      "A fresh start. You've got this.",
      "Study hard, stay consistent.",
      "Small steps lead to big results."
    ],
    afternoon: [
      "Keep the momentum going.",
      "Halfway there – stay focused.",
      "One task at a time.",
      "You're doing great, Vaibhav.",
      "Focus now, relax later."
    ],
    evening: [
      "Wind down, but finish strong.",
      "Review what you learned today.",
      "Rest well for tomorrow.",
      "Proud of the effort you put in.",
      "Tomorrow is another chance to improve."
    ],
    night: [
      "Late night focus mode.",
      "Don't forget to rest soon.",
      "Quiet hours are powerful.",
      "One more focused session?",
      "Sleep is also productivity."
    ]
  },

  updateGreeting() {
    const hour = new Date().getHours();
    let period, hello;
    if (hour >= 5 && hour < 12) {
      period = "morning";
      hello = "Good morning, Vaibhav";
    } else if (hour >= 12 && hour < 17) {
      period = "afternoon";
      hello = "Good afternoon, Vaibhav";
    } else if (hour >= 17 && hour < 21) {
      period = "evening";
      hello = "Good evening, Vaibhav";
    } else {
      period = "night";
      hello = "Hello, Vaibhav";
    }

    const msgs = this.messages[period];
    // Change message every ~30 min based on time slot
    const slot = Math.floor(Date.now() / (30 * 60 * 1000));
    const msg = msgs[slot % msgs.length];

    const gText = document.getElementById("greeting-text");
    const gMsg = document.getElementById("greeting-msg");
    if (gText) gText.textContent = hello;
    if (gMsg) gMsg.textContent = msg;
  },

  // ========== DATA SYNC (Export / Import) ==========
  exportData() {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      tasks: Store.getTasks(),
      events: Store.getEvents(),
      expenses: Store.getExpenses(),
      sessions: Store.getSessions(),
      budgets: Store.getBudgets(),
      settings: Store.getSettings()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `personal-pa-backup-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    Utils.toast("Data exported – save this file");
  },

  importData(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data || typeof data !== "object") throw new Error("Invalid file");

        if (Array.isArray(data.tasks)) Store.saveTasks(data.tasks);
        if (Array.isArray(data.events)) Store.saveEvents(data.events);
        if (Array.isArray(data.expenses)) Store.saveExpenses(data.expenses);
        if (Array.isArray(data.sessions)) Store.saveSessions(data.sessions);
        if (data.budgets) Store.saveBudgets(data.budgets);
        if (data.settings) Store.saveSettings(data.settings);

        Tasks.render();
        Tasks.renderProjectsBar();
        Events.render();
        Timer.renderStats();
        Timer.renderHistory();
        Timer.populateTaskSelect();
        Expenses.render();
        Dashboard.refresh();

        Utils.toast("Data imported successfully!");
      } catch (err) {
        console.error(err);
        Utils.toast("Import failed – invalid file");
      }
    };
    reader.readAsText(file);
  },


  async enableAutoSync() {
    try {
      const ok = await Store.linkSyncFile();
      if (ok) {
        Utils.toast("Auto-sync ON – data saves to your file automatically");
        this.updateSyncUI();
        // Reload UI from file in case file had newer data
        const data = await Store.readFromFile();
        if (data) {
          Store.applyAllData(data);
          Tasks.render();
          Tasks.renderProjectsBar();
          Events.render();
          Timer.renderStats();
          Timer.renderHistory();
          Timer.populateTaskSelect();
          Expenses.render();
          Dashboard.refresh();
        }
      }
    } catch (e) {
      Utils.toast(e.message || "Could not enable auto-sync");
    }
  },

  updateSyncUI() {
    const btn = document.getElementById("autosync-btn");
    if (!btn) return;
    if (Store.isSyncActive()) {
      btn.textContent = "🔄 Sync ON";
      btn.classList.add("sync-active");
      btn.title = "Auto-saving to linked file";
    } else if (Store.supportsFileSync()) {
      btn.textContent = "🔄 Auto-sync";
      btn.classList.remove("sync-active");
      btn.title = "Link a file (e.g. in Google Drive) for automatic save";
    } else {
      btn.textContent = "🔄";
      btn.title = "Auto-sync works on Chrome/Edge on PC";
      btn.style.opacity = "0.5";
    }
  },

  init() {

    // Auto-sync + Export / Import
    document.getElementById("autosync-btn")?.addEventListener("click", () => this.enableAutoSync());
    this.updateSyncUI();
    document.getElementById("export-btn").addEventListener("click", () => this.exportData());
    document.getElementById("import-btn").addEventListener("click", () => {
      document.getElementById("import-file").click();
    });
    document.getElementById("import-file").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) this.importData(file);
      e.target.value = "";
    });

    // Nav
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchView(btn.dataset.view));
    });

    // Quick add
    document.getElementById('quick-add-btn').addEventListener('click', () => this.openQuickAdd());
    document.querySelector('.modal-close').addEventListener('click', () => this.closeQuickAdd());
    document.getElementById('modal-overlay').addEventListener('click', e => {
      if (e.target === e.currentTarget) this.closeQuickAdd();
    });

    // Tabs
    document.querySelectorAll('.modal-tabs .tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });

    // Exam mode
    document.getElementById('mode-toggle').addEventListener('click', () => this.toggleExamMode());
    if (Store.getSettings().examMode) document.body.classList.add('exam-mode');

    // Keyboard shortcut Ctrl+Shift+A
    document.addEventListener('keydown', e => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        this.openQuickAdd();
      }
      if (e.key === 'Escape') this.closeQuickAdd();
    });

    // Forms
    document.getElementById('form-task').addEventListener('submit', e => {
      e.preventDefault();
      const titleRaw = document.getElementById('task-title').value.trim();
      if (!titleRaw) return;

      // Try natural language if it looks rich
      let data;
      if (/#|tomorrow|today|priority|Study|Personal/i.test(titleRaw)) {
        data = Utils.parseNaturalTask(titleRaw);
        // Override with explicit fields if filled
        const due = document.getElementById('task-due').value;
        if (due) data.due = due;
        data.priority = document.getElementById('task-priority').value || data.priority;
        data.project = document.getElementById('task-project').value || data.project;
        const tags = document.getElementById('task-tags').value;
        if (tags) data.tags = tags.split(',').map(t => t.trim()).filter(Boolean);
      } else {
        data = {
          title: titleRaw,
          due: document.getElementById('task-due').value || null,
          priority: document.getElementById('task-priority').value,
          project: document.getElementById('task-project').value,
          tags: document.getElementById('task-tags').value.split(',').map(t => t.trim()).filter(Boolean),
          notes: document.getElementById('task-notes').value
        };
      }

      Tasks.add(data);
      this.closeQuickAdd();
      Tasks.render();
      Tasks.renderProjectsBar();
      Dashboard.refresh();
      Utils.toast('Task added');
    });

    document.getElementById('form-expense').addEventListener('submit', e => {
      e.preventDefault();
      const amount = document.getElementById('exp-amount').value;
      if (!amount) return;
      Expenses.add({
        amount,
        category: document.getElementById('exp-category').value,
        mode: document.getElementById('exp-mode').value,
        date: document.getElementById('exp-date').value || Utils.today(),
        note: document.getElementById('exp-note').value
      });
      this.closeQuickAdd();
      Expenses.render();
      Dashboard.refresh();
      Utils.toast('Expense logged');
    });

    document.getElementById('form-event').addEventListener('submit', e => {
      e.preventDefault();
      const title = document.getElementById('event-title').value.trim();
      const start = document.getElementById('event-start').value;
      if (!title || !start) return;
      Events.add({
        title,
        start,
        end: document.getElementById('event-end').value || null,
        type: document.getElementById('event-type').value,
        location: document.getElementById('event-location').value,
        course: document.getElementById('event-course').value
      });
      this.closeQuickAdd();
      Events.render();
      Dashboard.refresh();
      Utils.toast('Event added');
    });

    document.getElementById('form-session').addEventListener('submit', e => {
      e.preventDefault();
      const mins = parseInt(document.getElementById('session-mode').value) || 25;
      Timer.focusSeconds = mins * 60;
      Timer.breakSeconds = Math.round(mins / 5) * 60;
      Timer.remaining = Timer.focusSeconds;
      Timer.totalSeconds = Timer.focusSeconds;
      Timer.linkedTaskId = document.getElementById('session-task').value || null;
      Timer.updateUI();
      this.closeQuickAdd();
      this.switchView('timer');
      Timer.start();
      Utils.toast('Session started');
    });

    // Greeting
    this.updateGreeting();
    setInterval(() => this.updateGreeting(), 60 * 1000);

    // Init modules
    Tasks.init();
    Events.init();
    Timer.init();
    Expenses.init();
    Dashboard.init();

    // Seed demo data if empty
    this.seedIfEmpty();
  },

  seedIfEmpty() {
    if (Tasks.getAll().length || Events.getAll().length) return;

    // Sample tasks
    Tasks.add({
      title: 'Submit Physics assignment',
      due: (() => { const d = new Date(); d.setDate(d.getDate() + 2); return d.toISOString().slice(0, 10); })(),
      priority: 'high',
      project: 'Study',
      tags: ['Physics']
    });
    Tasks.add({
      title: 'Revise Chapter 4 – Thermodynamics',
      due: Utils.today(),
      priority: 'high',
      project: 'Study'
    });
    Tasks.add({
      title: 'Buy stationery for exams',
      due: (() => { const d = new Date(); d.setDate(d.getDate() + 5); return d.toISOString().slice(0, 10); })(),
      priority: 'medium',
      project: 'Personal'
    });
    Tasks.add({
      title: 'Call home',
      priority: 'low',
      project: 'Personal'
    });

    // Sample events
    const midterm = new Date();
    midterm.setDate(midterm.getDate() + 12);
    midterm.setHours(10, 0, 0, 0);
    Events.add({
      title: 'Physics Midterm',
      start: midterm.toISOString().slice(0, 16),
      type: 'Exam',
      course: 'Physics',
      location: 'Hall B'
    });

    const assign = new Date();
    assign.setDate(assign.getDate() + 3);
    assign.setHours(23, 59, 0, 0);
    Events.add({
      title: 'Math Assignment Due',
      start: assign.toISOString().slice(0, 16),
      type: 'Assignment',
      course: 'Mathematics'
    });

    // Sample expense
    Expenses.add({
      amount: 120,
      category: 'Food',
      mode: 'UPI',
      note: 'Mess lunch',
      date: Utils.today()
    });
    Expenses.add({
      amount: 450,
      category: 'Study',
      mode: 'UPI',
      note: 'Printouts + notebook',
      date: Utils.today()
    });

    Tasks.render();
    Events.render();
    Expenses.render();
    Dashboard.refresh();
  }
};

// Boot
document.addEventListener('DOMContentLoaded', () => {
  App.init();
  const v = new URLSearchParams(location.search).get('view');
  if (v) setTimeout(() => App.switchView(v), 300);
});
