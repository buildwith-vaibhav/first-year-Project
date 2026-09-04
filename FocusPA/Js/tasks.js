const Tasks = {
  filter: 'today',
  projectFilter: null,
  search: '',

  getAll() {
    return Store.getTasks();
  },

  add(data) {
    const tasks = this.getAll();
    const task = {
      id: Utils.uid(),
      title: data.title,
      due: data.due || null,
      priority: data.priority || 'medium',
      project: data.project || 'Personal',
      tags: data.tags || [],
      notes: data.notes || '',
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    tasks.unshift(task);
    Store.saveTasks(tasks);
    return task;
  },

  update(id, updates) {
    const tasks = this.getAll();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    tasks[idx] = { ...tasks[idx], ...updates };
    Store.saveTasks(tasks);
    return tasks[idx];
  },

  toggleComplete(id) {
    const task = this.getAll().find(t => t.id === id);
    if (!task) return;
    return this.update(id, {
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null
    });
  },

  remove(id) {
    const tasks = this.getAll().filter(t => t.id !== id);
    Store.saveTasks(tasks);
  },

  getFiltered() {
    let list = this.getAll();

    if (this.search) {
      const q = this.search.toLowerCase();
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.tags || []).some(tag => tag.toLowerCase().includes(q)) ||
        (t.project || '').toLowerCase().includes(q)
      );
    }

    if (this.projectFilter) {
      list = list.filter(t => t.project === this.projectFilter);
    }

    switch (this.filter) {
      case 'today':
        list = list.filter(t => !t.completed && (Utils.isToday(t.due) || !t.due));
        break;
      case 'upcoming':
        list = list.filter(t => !t.completed && t.due && Utils.isUpcoming(t.due, 30));
        break;
      case 'overdue':
        list = list.filter(t => !t.completed && Utils.isOverdue(t.due));
        break;
      case 'focus':
        list = list
          .filter(t => !t.completed)
          .sort((a, b) => {
            const p = { high: 0, medium: 1, low: 2 };
            return (p[a.priority] || 1) - (p[b.priority] || 1);
          })
          .slice(0, 3);
        break;
      case 'all':
      default:
        // show incomplete first, then completed
        list = list.sort((a, b) => Number(a.completed) - Number(b.completed));
        break;
    }

    // Sort by priority then due
    if (this.filter !== 'focus') {
      list.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const p = { high: 0, medium: 1, low: 2 };
        if (p[a.priority] !== p[b.priority]) return p[a.priority] - p[b.priority];
        if (a.due && b.due) return a.due.localeCompare(b.due);
        if (a.due) return -1;
        return 1;
      });
    }

    return list;
  },

  getTop3() {
    return this.getAll()
      .filter(t => !t.completed)
      .sort((a, b) => {
        const p = { high: 0, medium: 1, low: 2 };
        if (p[a.priority] !== p[b.priority]) return p[a.priority] - p[b.priority];
        if (a.due && b.due) return a.due.localeCompare(b.due);
        if (a.due) return -1;
        return 1;
      })
      .slice(0, 3);
  },

  getOverdueCount() {
    return this.getAll().filter(t => !t.completed && Utils.isOverdue(t.due)).length;
  },

  getUpcomingCount() {
    return this.getAll().filter(t => !t.completed && t.due && Utils.isUpcoming(t.due, 7)).length;
  },

  getProjects() {
    const set = new Set(this.getAll().map(t => t.project || 'Personal'));
    return ['Study', 'Personal', 'Part-time', 'College', ...[...set].filter(p => !['Study', 'Personal', 'Part-time', 'College'].includes(p))];
  },

  render() {
    const list = this.getFiltered();
    const container = document.getElementById('tasks-list');
    const empty = document.getElementById('tasks-empty');

    if (!list.length) {
      container.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');

    container.innerHTML = list.map(t => this.renderItem(t)).join('');
  },

  renderItem(t) {
    const dueStr = t.due
      ? (Utils.isOverdue(t.due) && !t.completed
          ? `<span class="overdue">Overdue · ${Utils.formatDate(t.due)}</span>`
          : Utils.formatDate(t.due))
      : '';
    const prioClass = `priority-${t.priority}`;
    return `
      <div class="task-item ${t.completed ? 'completed' : ''}" data-id="${t.id}">
        <div class="task-check ${t.completed ? 'checked' : ''}" data-action="toggle">
          ${t.completed ? '✓' : ''}
        </div>
        <div class="task-content">
          <div class="task-title">${this.escape(t.title)}</div>
          <div class="task-meta">
            <span class="${prioClass}">${t.priority}</span>
            <span>${t.project}</span>
            ${dueStr ? `<span>${dueStr}</span>` : ''}
            ${(t.tags || []).map(tag => `<span>#${tag}</span>`).join('')}
          </div>
        </div>
        <div class="task-actions">
          <button data-action="delete" title="Delete">🗑</button>
        </div>
      </div>
    `;
  },

  renderProjectsBar() {
    const bar = document.getElementById('projects-bar');
    const projects = this.getProjects();
    bar.innerHTML = `
      <span class="project-chip ${!this.projectFilter ? 'active' : ''}" data-project="">All</span>
      ${projects.map(p => `
        <span class="project-chip ${this.projectFilter === p ? 'active' : ''}" data-project="${p}">${p}</span>
      `).join('')}
    `;
  },

  escape(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  init() {
    // Filters
    document.querySelectorAll('#view-tasks .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#view-tasks .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filter = btn.dataset.filter;
        this.render();
      });
    });

    // Search
    document.getElementById('task-search').addEventListener('input', e => {
      this.search = e.target.value.trim();
      this.render();
    });

    // Projects
    document.getElementById('projects-bar').addEventListener('click', e => {
      const chip = e.target.closest('.project-chip');
      if (!chip) return;
      this.projectFilter = chip.dataset.project || null;
      this.renderProjectsBar();
      this.render();
    });

    // Task actions
    document.getElementById('tasks-list').addEventListener('click', e => {
      const item = e.target.closest('.task-item');
      if (!item) return;
      const id = item.dataset.id;
      const action = e.target.closest('[data-action]')?.dataset.action;

      if (action === 'toggle' || e.target.classList.contains('task-check')) {
        this.toggleComplete(id);
        this.render();
        Dashboard.refresh();
        Utils.toast('Task updated');
      } else if (action === 'delete') {
        if (confirm('Delete this task?')) {
          this.remove(id);
          this.render();
          Dashboard.refresh();
          Utils.toast('Task deleted');
        }
      }
    });

    this.renderProjectsBar();
    this.render();
  }
};
