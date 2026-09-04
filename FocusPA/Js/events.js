const Events = {
  view: 'upcoming',

  getAll() {
    return Store.getEvents();
  },

  add(data) {
    const events = this.getAll();
    const event = {
      id: Utils.uid(),
      title: data.title,
      start: data.start,
      end: data.end || null,
      type: data.type || 'Other',
      location: data.location || '',
      course: data.course || '',
      createdAt: new Date().toISOString()
    };
    events.push(event);
    events.sort((a, b) => a.start.localeCompare(b.start));
    Store.saveEvents(events);
    return event;
  },

  remove(id) {
    Store.saveEvents(this.getAll().filter(e => e.id !== id));
  },

  getUpcoming(limit = 20) {
    const now = new Date().toISOString();
    return this.getAll()
      .filter(e => e.start >= now.slice(0, 16) || Utils.isToday(e.start))
      .slice(0, limit);
  },

  getNext() {
    return this.getUpcoming(1)[0] || null;
  },

  getDeadlines() {
    return this.getAll()
      .filter(e => e.type === 'Exam' || e.type === 'Assignment')
      .filter(e => e.start >= new Date().toISOString().slice(0, 10))
      .sort((a, b) => a.start.localeCompare(b.start));
  },

  render() {
    const listEl = document.getElementById('events-list');
    const empty = document.getElementById('events-empty');
    const cal = document.getElementById('events-calendar');

    if (this.view === 'month') {
      listEl.classList.add('hidden');
      cal.classList.remove('hidden');
      empty.classList.add('hidden');
      this.renderCalendar();
      return;
    }

    cal.classList.add('hidden');
    listEl.classList.remove('hidden');

    let events = this.view === 'deadlines' ? this.getDeadlines() : this.getUpcoming();

    if (!events.length) {
      listEl.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');

    listEl.innerHTML = events.map(e => {
      const days = Utils.daysUntil(e.start);
      let countdown = '';
      if (days === 0) countdown = '<span class="countdown">Today</span>';
      else if (days === 1) countdown = '<span class="countdown">Tomorrow</span>';
      else if (days > 1) countdown = `<span class="countdown">${days} days left</span>`;

      const d = new Date(e.start);
      return `
        <div class="event-item" data-id="${e.id}">
          <div class="event-date-box">
            <div class="day">${d.getDate()}</div>
            <div class="month">${d.toLocaleString('en', { month: 'short' })}</div>
          </div>
          <div class="event-content">
            <div class="event-title">${this.escape(e.title)}</div>
            <div class="event-meta">
              <span class="event-type ${e.type}">${e.type}</span>
              <span>${Utils.formatDateTime(e.start)}</span>
              ${e.location ? `<span>📍 ${this.escape(e.location)}</span>` : ''}
              ${e.course ? `<span>${this.escape(e.course)}</span>` : ''}
              ${countdown}
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  renderCalendar() {
    // Simple month list for MVP
    const cal = document.getElementById('events-calendar');
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const events = this.getAll().filter(e => {
      const d = new Date(e.start);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    cal.innerHTML = `
      <div class="card">
        <h3 style="margin-bottom:12px">${Utils.monthLabel(now)}</h3>
        ${events.length ? events.map(e => `
          <div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:0.9rem">
            <strong>${Utils.formatDate(e.start)}</strong> — ${this.escape(e.title)}
            <span class="event-type ${e.type}" style="margin-left:8px">${e.type}</span>
          </div>
        `).join('') : '<p class="empty-state">No events this month</p>'}
      </div>
    `;
  },

  escape(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  init() {
    document.querySelectorAll('#view-events .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#view-events .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.view = btn.dataset.eventView;
        this.render();
      });
    });

    document.getElementById('events-list').addEventListener('click', e => {
      const item = e.target.closest('.event-item');
      if (!item) return;
      // Future: open detail / edit
    });

    this.render();
  }
};
