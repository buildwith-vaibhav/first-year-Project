// Offline-first storage with localStorage + optional auto file sync (PC)
const Store = {
  KEYS: {
    tasks: 'ppa_tasks',
    events: 'ppa_events',
    expenses: 'ppa_expenses',
    sessions: 'ppa_sessions',
    budgets: 'ppa_budgets',
    settings: 'ppa_settings'
  },

  _fileHandle: null,
  _saveTimer: null,
  _syncEnabled: false,

  get(key) {
    try {
      const raw = localStorage.getItem(this.KEYS[key] || key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  set(key, value) {
    localStorage.setItem(this.KEYS[key] || key, JSON.stringify(value));
    this.scheduleFileSync();
  },

  getTasks() { return this.get('tasks') || []; },
  saveTasks(tasks) { this.set('tasks', tasks); },

  getEvents() { return this.get('events') || []; },
  saveEvents(events) { this.set('events', events); },

  getExpenses() { return this.get('expenses') || []; },
  saveExpenses(expenses) { this.set('expenses', expenses); },

  getSessions() { return this.get('sessions') || []; },
  saveSessions(sessions) { this.set('sessions', sessions); },

  getBudgets() {
    return this.get('budgets') || {
      Food: 3000, Transport: 1500, Study: 2000, Entertainment: 1500,
      Rent: 8000, Subscriptions: 500, Other: 1000
    };
  },
  saveBudgets(budgets) { this.set('budgets', budgets); },

  getSettings() {
    return this.get('settings') || {
      examMode: false, dailyStudyGoal: 4, theme: 'dark', autoSync: false
    };
  },
  saveSettings(settings) {
    localStorage.setItem(this.KEYS.settings, JSON.stringify(settings));
    this.scheduleFileSync();
  },

  getAllData() {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      tasks: this.getTasks(),
      events: this.getEvents(),
      expenses: this.getExpenses(),
      sessions: this.getSessions(),
      budgets: this.getBudgets(),
      settings: this.getSettings()
    };
  },

  applyAllData(data) {
    if (!data || typeof data !== 'object') return false;
    if (Array.isArray(data.tasks)) {
      localStorage.setItem(this.KEYS.tasks, JSON.stringify(data.tasks));
    }
    if (Array.isArray(data.events)) {
      localStorage.setItem(this.KEYS.events, JSON.stringify(data.events));
    }
    if (Array.isArray(data.expenses)) {
      localStorage.setItem(this.KEYS.expenses, JSON.stringify(data.expenses));
    }
    if (Array.isArray(data.sessions)) {
      localStorage.setItem(this.KEYS.sessions, JSON.stringify(data.sessions));
    }
    if (data.budgets) {
      localStorage.setItem(this.KEYS.budgets, JSON.stringify(data.budgets));
    }
    if (data.settings) {
      const cur = this.getSettings();
      localStorage.setItem(this.KEYS.settings, JSON.stringify({ ...data.settings, autoSync: cur.autoSync }));
    }
    return true;
  },

  supportsFileSync() {
    return typeof window !== 'undefined' && 'showSaveFilePicker' in window;
  },

  async linkSyncFile() {
    if (!this.supportsFileSync()) {
      throw new Error('Auto file sync works in Chrome or Edge on computer only');
    }
    try {
      let handle;
      try {
        const [h] = await window.showOpenFilePicker({
          types: [{ description: 'Personal PA Data', accept: { 'application/json': ['.json'] } }],
          multiple: false
        });
        handle = h;
      } catch (e) {
        if (e.name === 'AbortError') {
          handle = await window.showSaveFilePicker({
            suggestedName: 'personal-pa-data.json',
            types: [{ description: 'Personal PA Data', accept: { 'application/json': ['.json'] } }]
          });
        } else {
          throw e;
        }
      }

      this._fileHandle = handle;
      this._syncEnabled = true;
      const settings = this.getSettings();
      settings.autoSync = true;
      localStorage.setItem(this.KEYS.settings, JSON.stringify(settings));

      await this.writeToFile();
      return true;
    } catch (e) {
      if (e.name === 'AbortError') return false;
      throw e;
    }
  },

  async writeToFile() {
    if (!this._fileHandle) return;
    try {
      const writable = await this._fileHandle.createWritable();
      await writable.write(JSON.stringify(this.getAllData(), null, 2));
      await writable.close();
    } catch (e) {
      console.warn('Auto-save to file failed', e);
      this._syncEnabled = false;
    }
  },

  async readFromFile() {
    if (!this._fileHandle) return null;
    try {
      const file = await this._fileHandle.getFile();
      const text = await file.text();
      return JSON.parse(text);
    } catch (e) {
      console.warn('Auto-load from file failed', e);
      return null;
    }
  },

  scheduleFileSync() {
    if (!this._syncEnabled || !this._fileHandle) return;
    clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(() => this.writeToFile(), 800);
  },

  isSyncActive() {
    return !!(this._syncEnabled && this._fileHandle);
  }
};
