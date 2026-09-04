const Utils = {
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  },

  today() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  },

  formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  },

  formatDateTime(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  },

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  },

  daysUntil(iso) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(iso);
    target.setHours(0, 0, 0, 0);
    return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  },

  isToday(iso) {
    return iso && iso.slice(0, 10) === this.today();
  },

  isOverdue(iso) {
    if (!iso) return false;
    return iso.slice(0, 10) < this.today();
  },

  isUpcoming(iso, days = 14) {
    if (!iso) return false;
    const diff = this.daysUntil(iso);
    return diff >= 0 && diff <= days;
  },

  startOfMonth(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  },

  endOfMonth(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
  },

  monthLabel(date = new Date()) {
    return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  },

  formatINR(n) {
    return '₹' + Number(n || 0).toLocaleString('en-IN');
  },

  toast(msg, duration = 2500) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.add('hidden'), duration);
  },

  // Simple natural language parser for tasks
  parseNaturalTask(text) {
    const result = {
      title: text,
      due: null,
      priority: 'medium',
      project: 'Personal',
      tags: []
    };

    // Priority
    const prioMatch = text.match(/priority\s*:\s*(high|medium|low)/i);
    if (prioMatch) {
      result.priority = prioMatch[1].toLowerCase();
      text = text.replace(prioMatch[0], '').trim();
    }
    if (/\b(urgent|asap|important)\b/i.test(text)) result.priority = 'high';

    // Tags #tag
    const tags = [...text.matchAll(/#(\w+)/g)].map(m => m[1]);
    if (tags.length) {
      result.tags = tags;
      text = text.replace(/#\w+/g, '').trim();
    }

    // Project
    const projMatch = text.match(/\b(Study|Personal|Part-time|College)\b/i);
    if (projMatch) {
      result.project = projMatch[1].charAt(0).toUpperCase() + projMatch[1].slice(1).toLowerCase();
      if (result.project === 'Part-time') result.project = 'Part-time';
    }

    // Dates
    const lower = text.toLowerCase();
    const today = new Date();
    if (/\btomorrow\b/.test(lower)) {
      const t = new Date(today);
      t.setDate(t.getDate() + 1);
      result.due = t.toISOString().slice(0, 10);
      text = text.replace(/\btomorrow\b/i, '').trim();
    } else if (/\btoday\b/.test(lower)) {
      result.due = this.today();
      text = text.replace(/\btoday\b/i, '').trim();
    } else if (/\bnext week\b/.test(lower)) {
      const t = new Date(today);
      t.setDate(t.getDate() + 7);
      result.due = t.toISOString().slice(0, 10);
      text = text.replace(/\bnext week\b/i, '').trim();
    }

    // Time like 6pm
    const timeMatch = text.match(/\b(\d{1,2})\s*(am|pm)\b/i);
    if (timeMatch && result.due) {
      let h = parseInt(timeMatch[1]);
      if (timeMatch[2].toLowerCase() === 'pm' && h < 12) h += 12;
      if (timeMatch[2].toLowerCase() === 'am' && h === 12) h = 0;
      result.due += `T${String(h).padStart(2, '0')}:00`;
      text = text.replace(timeMatch[0], '').trim();
    }

    result.title = text.replace(/\s+/g, ' ').trim() || 'Untitled task';
    return result;
  }
};
