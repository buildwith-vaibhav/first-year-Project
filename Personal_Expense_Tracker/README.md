# Personal Expense Tracker

A simple command-line Personal Expense Tracker written in Python. It stores data in JSON and supports categories, search, summary reports, and CSV export.

## Features

- **Add Expense** – Record amount, category, date, and optional note
- **View All Expenses** – Display all expenses in a sorted table with total
- **Search by Category** – Filter expenses by Food, Travel, Shopping, Bills, Education, or Other
- **Delete Expense** – Remove an expense by its ID
- **Summary Report** – Total spent, average, breakdown by category (%), and by month
- **Export to CSV** – Save all expenses to `expenses_export.csv`
- **Persistent Storage** – Data is saved in `expenses.json`
- **Input Validation** – Valid amounts (> 0) and dates (YYYY-MM-DD)

## Requirements

- Python 3.6 or higher
- No external libraries required (uses only the Python standard library)

## How to Run

1. Open a terminal in the `Personal_Expense_Tracker` folder.

2. Run the program:
   ```bash
   python personal_expense_tracker.py
   ```

3. Follow the on-screen menu.

## Menu Options

```
========================================
   PERSONAL EXPENSE TRACKER
========================================

1. Add expense
2. View all expenses
3. Search by category
4. Delete expense
5. Summary report
6. Export to CSV
7. Exit
```

## Project Structure

```
Personal_Expense_Tracker/
├── personal_expense_tracker.py   # Main application
├── expenses.json                 # Data file (created automatically)
├── expenses_export.csv           # Created when you export
└── README.md
```

## Data Format

Expenses are stored in `expenses.json` as a list of objects:

| Field    | Description                          |
|----------|--------------------------------------|
| id       | Unique integer ID                    |
| amount   | Amount in Rs. (positive number)      |
| category | Food / Travel / Shopping / Bills / Education / Other |
| date     | Date (YYYY-MM-DD)                    |
| note     | Optional short note                  |

## Example Usage

```
Enter your choice (1-7): 1
--- Add Expense ---
Amount (Rs.): 250
Categories:
  1. Food
  2. Travel
  3. Shopping
  4. Bills
  5. Education
  6. Other
Choose category number: 1
Date (YYYY-MM-DD, press Enter for today): 
Note (optional): Lunch
Expense added with ID 1.

Enter your choice (1-7): 5
--- Summary Report ---
Total spent : Rs. 250.00
Entries     : 1
Average     : Rs. 250.00

By category:
  Food         Rs.    250.00  (100.0%)

By month:
  2026-09   Rs.    250.00
```

## Screenshots

> Add your terminal screenshots here after running the program.
>
> Suggested filenames:
> - `ss_00_main_menu.png`
> - `ss_01_add_expense.png`
> - `ss_02_view_all.png`
> - `ss_03_summary_report.png`
> - `ss_04_export_csv.png`

## Notes

- `expenses.json` is created automatically when you add the first expense.
- Amounts must be greater than zero.
- Leave the date blank to use today’s date.
- Export creates/overwrites `expenses_export.csv` in the same folder.
