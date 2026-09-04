const Timer = {
  mode: '25/5', // focus/break minutes
  focusSeconds: 25 * 60,
  breakSeconds: 5 * 60,
  remaining: 25 * 60,
  isRunning: false,
  isBreak: false,
  interval: null,
  linkedTaskId: null,
  totalSeconds: 25 * 60,

  modes: {
    '25/5': [25, 5],
    '45/10': [45, 10],
    '50/10': [50, 10],
    custom: [30, 5]
  },

  setMode(mode) {
    this.mode = mode;
    const [f, b] = this.modes[mode] || [25, 5];
    this.focusSeconds = f * 60;
    this.breakSeconds = b * 60;
    this.reset();
  },

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    document.getElementById('timer-start').classList.add('hidden');
    document.getElementById('timer-pause').classList.remove('hidden');

    this.interval = setInterval(() => {
      this.remaining--;
      this.updateUI();

      if (this.remaining <= 0) {
        this.completeSession();
      }
    }, 1000);
  },

  pause() {
    this.isRunning = false;
    clearInterval(this.interval);
    document.getElementById('timer-start').classList.remove('hidden');
    document.getElementById('timer-pause').classList.add('hidden');
  },

  reset() {
    this.pause();
    this.isBreak = false;
    this.remaining = this.focusSeconds;
    this.totalSeconds = this.focusSeconds;
    this.updateUI();
  },

  completeSession() {
    this.pause();

    if (!this.isBreak) {
      // Log focus session
      const minutes = Math.round(this.focusSeconds / 60);
      const sessions = Store.getSessions();
      const task = this.linkedTaskId
        ? Tasks.getAll().find(t => t.id === this.linkedTaskId)
        : null;

      sessions.unshift({
        id: Utils.uid(),
        date: Utils.today(),
        duration: minutes,
        taskId: this.linkedTaskId,
        taskTitle: task ? task.title : 'Free focus',
        subject: task ? task.project : 'General',
        createdAt: new Date().toISOString()
      });
      Store.saveSessions(sessions);

      Utils.toast(`Focus complete! +${minutes} min`);
      this.isBreak = true;
      this.remaining = this.breakSeconds;
      this.totalSeconds = this.breakSeconds;
      this.updateUI();
      // Auto start break? Optional – leave manual for now
    } else {
      Utils.toast('Break over – ready for next session');
      this.isBreak = false;
      this.remaining = this.focusSeconds;
      this.totalSeconds = this.focusSeconds;
      this.updateUI();
    }

    this.renderStats();
    this.renderHistory();
    Dashboard.refresh();
  },

  updateUI() {
    document.getElementById('timer-time').textContent = Utils.formatTime(this.remaining);
    document.getElementById('timer-label').textContent = this.isBreak ? 'Break' : 'Focus';

    const circle = document.getElementById('timer-progress');
    const r = 100;
    const circumference = 2 * Math.PI * r;
    const progress = this.remaining / this.totalSeconds;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference * (1 - progress);
  },

  getTodayMinutes() {
    return Store.getSessions()
      .filter(s => s.date === Utils.today())
      .reduce((sum, s) => sum + (s.duration || 0), 0);
  },

  getTodaySessions() {
    return Store.getSessions().filter(s => s.date === Utils.today()).length;
  },

  getStreak() {
    const sessions = Store.getSessions();
    if (!sessions.length) return 0;
    const days = [...new Set(sessions.map(s => s.date))].sort().reverse();
    let streak = 0;
    let expected = Utils.today();
    for (const d of days) {
      if (d === expected) {
        streak++;
        const prev = new Date(expected);
        prev.setDate(prev.getDate() - 1);
        expected = prev.toISOString().slice(0, 10);
      } else break;
    }
    return streak;
  },

  renderStats() {
    document.getElementById('today-focus').textContent = this.getTodayMinutes();
    document.getElementById('today-sessions').textContent = this.getTodaySessions();
  },

  renderHistory() {
    const list = document.getElementById('session-list');
    const recent = Store.getSessions().slice(0, 8);
    if (!recent.length) {
      list.innerHTML = '<p class="empty-state" style="padding:12px 0">No sessions yet</p>';
      return;
    }
    list.innerHTML = recent.map(s => `
      <div class="session-item">
        <span>${s.taskTitle || 'Focus'} · ${s.subject || ''}</span>
        <span>${s.duration} min · ${Utils.formatDate(s.date)}</span>
      </div>
    `).join('');
  },

  populateTaskSelect() {
    const selects = [document.getElementById('timer-task'), document.getElementById('session-task')];
    const openTasks = Tasks.getAll().filter(t => !t.completed).slice(0, 30);
    selects.forEach(sel => {
      if (!sel) return;
      const current = sel.value;
      sel.innerHTML = '<option value="">— Free focus —</option>' +
        openTasks.map(t => `<option value="${t.id}">${t.title} (${t.project})</option>`).join('');
      sel.value = current;
    });
  },

  init() {
    // Mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setMode(btn.dataset.mode);
      });
    });

    document.getElementById('timer-start').addEventListener('click', () => {
      this.linkedTaskId = document.getElementById('timer-task').value || null;
      this.start();
    });

    document.getElementById('timer-pause').addEventListener('click', () => this.pause());
    document.getElementById('timer-reset').addEventListener('click', () => this.reset());

    document.getElementById('timer-task').addEventListener('change', e => {
      this.linkedTaskId = e.target.value || null;
    });

    this.reset();
    this.renderStats();
    this.renderHistory();
    this.populateTaskSelect();
  }
};
