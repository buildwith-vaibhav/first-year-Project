const Expenses = {
  currentMonth: new Date(),

  getAll() {
    return Store.getExpenses();
  },

  add(data) {
    const expenses = this.getAll();
    const exp = {
      id: Utils.uid(),
      amount: Number(data.amount),
      category: data.category || 'Other',
      mode: data.mode || 'UPI',
      note: data.note || '',
      date: data.date || Utils.today(),
      createdAt: new Date().toISOString()
    };
    expenses.unshift(exp);
    Store.saveExpenses(expenses);
    return exp;
  },

  remove(id) {
    Store.saveExpenses(this.getAll().filter(e => e.id !== id));
  },

  getForMonth(date = this.currentMonth) {
    const y = date.getFullYear();
    const m = date.getMonth();
    return this.getAll().filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === y && d.getMonth() === m;
    });
  },

  getTotal(date = this.currentMonth) {
    return this.getForMonth(date).reduce((s, e) => s + e.amount, 0);
  },

  getByCategory(date = this.currentMonth) {
    const map = {};
    this.getForMonth(date).forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return map;
  },

  getBudgets() {
    return Store.getBudgets();
  },

  render() {
    const label = document.getElementById('exp-month-label');
    label.textContent = Utils.monthLabel(this.currentMonth);

    const total = this.getTotal();
    document.getElementById('exp-total').textContent = Utils.formatINR(total);

    // Budget bars
    const budgets = this.getBudgets();
    const byCat = this.getByCategory();
    const bars = document.getElementById('exp-budget-bars');
    const cats = Object.keys(budgets);

    bars.innerHTML = cats.map(cat => {
      const spent = byCat[cat] || 0;
      const budget = budgets[cat] || 0;
      const pct = budget ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
      let cls = 'ok';
      if (pct >= 90) cls = 'over';
      else if (pct >= 70) cls = 'warn';

      return `
        <div class="budget-bar">
          <div class="budget-bar-header">
            <span>${cat}</span>
            <span>${Utils.formatINR(spent)} / ${Utils.formatINR(budget)}</span>
          </div>
          <div class="budget-bar-track">
            <div class="budget-bar-fill ${cls}" style="width:${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');

    // List
    const list = this.getForMonth().sort((a, b) => b.date.localeCompare(a.date));
    const listEl = document.getElementById('expenses-list');
    const empty = document.getElementById('expenses-empty');

    if (!list.length) {
      listEl.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');

    listEl.innerHTML = list.map(e => `
      <div class="expense-item" data-id="${e.id}">
        <div class="left">
          <span class="cat">${e.category}</span>
          <span class="note">${e.note || e.mode} · ${Utils.formatDate(e.date)}</span>
        </div>
        <span class="amount negative">-${Utils.formatINR(e.amount)}</span>
      </div>
    `).join('');
  },

  exportCSV() {
    const list = this.getForMonth();
    if (!list.length) {
      Utils.toast('No data to export');
      return;
    }
    const header = 'Date,Category,Amount,Mode,Note\n';
    const rows = list.map(e =>
      `${e.date},${e.category},${e.amount},${e.mode},"${(e.note || '').replace(/"/g, '""')}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${Utils.monthLabel(this.currentMonth).replace(' ', '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    Utils.toast('CSV exported');
  },

  init() {
    document.getElementById('exp-prev').addEventListener('click', () => {
      this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
      this.render();
    });
    document.getElementById('exp-next').addEventListener('click', () => {
      this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
      this.render();
    });
    document.getElementById('export-csv').addEventListener('click', () => this.exportCSV());

    this.render();
  }
};
