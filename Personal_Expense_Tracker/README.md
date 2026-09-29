# Personal Expense Tracker

A simple command-line personal expense tracker written in Python. It stores data in JSON, supports categories, search, summary reports, and CSV export.

## Features

- **Add Expense** – Record amount, category, date, and optional note
- **View All Expenses** – Display all entries in a sorted table with total
- **Search by Category** – Filter expenses by Food, Travel, Shopping, Bills, Education, or Other
- **Delete Expense** – Remove an entry by its ID
- **Summary Report** – Total spent, average, breakdown by category (%) and by month
- **Export to CSV** – Save all expenses to `expenses_export.csv`
- **Persistent Storage** – Data is saved in `expenses.json`
- **Input Validation** – Validates amount (> 0) and date format (YYYY-MM-DD)

## Requirements

- Python 3.6 or higher
- No external libraries required (uses only the Python standard library)

## How to Run

1. Open a terminal in the `Personal_Expense_Tracker` folder.

2. Run the program:
   ```bash
   python personal_expense_tracker.py
   ```

3. Follow the on-screen menu to manage your expenses.

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
├── expenses_export.csv           # CSV export (created when you export)
└── README.md
```

## Categories

| Number | Category   |
|--------|------------|
| 1      | Food       |
| 2      | Travel     |
| 3      | Shopping   |
| 4      | Bills      |
| 5      | Education  |
| 6      | Other      |

## Data Format

Expenses are stored in `expenses.json` with the following fields:

| Field    | Description                          |
|----------|--------------------------------------|
| id       | Unique integer ID                    |
| amount   | Expense amount (Rs.)                 |
| category | One of the predefined categories     |
| date     | Date of expense (YYYY-MM-DD)         |
| note     | Optional note                        |

## Example Usage

```
Enter your choice (1-7): 1

--- Add Expense ---
Amount (Rs.): 250.50
Categories:
  1. Food
  2. Travel
  3. Shopping
  4. Bills
  5. Education
  6. Other
Choose category number: 1
Date (YYYY-MM-DD, press Enter for today): 
Note (optional): Lunch with friends
Expense added with ID 1.

Enter your choice (1-7): 5

--- Summary Report ---
Total spent : Rs. 250.50
Entries     : 1
Average     : Rs. 250.50

By category:
  Food         Rs.    250.50  (100.0%)

By month:
  2026-09   Rs.    250.50
```

## Screenshots

> Add your terminal screenshots here after running the program (main menu, add expense, view all, summary report, export, etc.).
>
> Suggested filenames:
> - `ss_00_main_menu.png`
> - `ss_01_add_expense.png`
> - `ss_02_view_expenses.png`
> - `ss_03_summary_report.png`
> - `ss_04_export_csv.png`

## Notes

- The JSON file (`expenses.json`) is created automatically when you add the first expense.
- Amounts must be greater than zero.
- Press Enter at the date prompt to use today's date.
- Choosing option 7 exits; data is saved on every add/delete.
