const Dashboard = {
  refresh() {
    this.renderTasks();
    this.renderNextEvent();
    this.renderStudy();
    this.renderBudget();
    this.renderQuickStats();
  },

  renderTasks() {
    const top = Tasks.getTop3();
    const list = document.getElementById('dash-tasks-list');
    const empty = document.getElementById('dash-tasks-empty');

    if (!top.length) {
      list.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');
    list.innerHTML = top.map(t => Tasks.renderItem(t)).join('');

    // Allow toggle from dashboard
    list.querySelectorAll('.task-check').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        const item = el.closest('.task-item');
        Tasks.toggleComplete(item.dataset.id);
        this.refresh();
        Tasks.render();
      });
    });
  },

  renderNextEvent() {
    const el = document.getElementById('dash-next-event');
    const next = Events.getNext();
    if (!next) {
      el.innerHTML = '<p class="empty-state" style="padding:12px 0">No upcoming events</p>';
      return;
    }
    const days = Utils.daysUntil(next.start);
    let countdown = days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days} days`;
    el.innerHTML = `
      <div style="display:flex;gap:12px;align-items:center">
        <div>
          <div style="font-weight:600;font-size:1.05rem;margin-bottom:4px">${Events.escape(next.title)}</div>
          <div style="font-size:0.85rem;color:var(--text-muted)">
            <span class="event-type ${next.type}">${next.type}</span>
            · ${Utils.formatDateTime(next.start)}
          </div>
        </div>
        <div style="margin-left:auto;text-align:right">
          <div class="countdown" style="font-size:1.1rem">${countdown}</div>
        </div>
      </div>
    `;
  },

  renderStudy() {
    const settings = Store.getSettings();
    const goal = settings.dailyStudyGoal || 4;
    const minutes = Timer.getTodayMinutes();
    const hours = (minutes / 60).toFixed(1);
    const pct = Math.min(1, minutes / (goal * 60));

    document.getElementById('study-hours').textContent = hours;
    document.getElementById('study-goal').textContent = goal;
    document.getElementById('study-streak').textContent = `🔥 ${Timer.getStreak()} day streak`;

    const circle = document.getElementById('study-ring');
    const r = 34;
    const circumference = 2 * Math.PI * r;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference * (1 - pct);
  },

  renderBudget() {
    const el = document.getElementById('dash-budget-summary');
    const total = Expenses.getTotal();
    const byCat = Expenses.getByCategory();
    const budgets = Expenses.getBudgets();

    // Show top 3 categories by spend + remaining for Food if exists
    const topCats = Object.entries(byCat)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    let html = `<div style="font-size:1.4rem;font-weight:700;margin-bottom:8px">${Utils.formatINR(total)} spent</div>`;

    if (budgets.Food) {
      const spent = byCat.Food || 0;
      const left = Math.max(0, budgets.Food - spent);
      html += `<div style="font-size:0.9rem;color:var(--text-muted);margin-bottom:8px">
        Food: ${Utils.formatINR(left)} left of ${Utils.formatINR(budgets.Food)}
      </div>`;
    }

    if (topCats.length) {
      html += topCats.map(([cat, amt]) =>
        `<div style="font-size:0.85rem;display:flex;justify-content:space-between;padding:2px 0">
          <span>${cat}</span><span>${Utils.formatINR(amt)}</span>
        </div>`
      ).join('');
    } else {
      html += '<p style="font-size:0.85rem;color:var(--text-muted)">No expenses yet this month</p>';
    }

    el.innerHTML = html;
  },

  renderQuickStats() {
    document.getElementById('stat-overdue').textContent = Tasks.getOverdueCount();
    document.getElementById('stat-upcoming').textContent = Tasks.getUpcomingCount();
    document.getElementById('stat-events').textContent = Events.getUpcoming().length;
    document.getElementById('stat-spent').textContent = Utils.formatINR(Expenses.getTotal());
  },

  init() {
    document.querySelectorAll('[data-goto]').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.goto;
        App.switchView(view);
      });
    });
    this.refresh();
  }
};
