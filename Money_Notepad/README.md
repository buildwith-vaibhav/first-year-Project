# Money Notepad

A simple command-line income & expense tracker written in Python. It uses a CSV file for persistent storage so your transactions are saved between sessions.

## Features

- **Add Income** – Record income with description and amount
- **Add Expense** – Record expenses with description and amount
- **View Transactions** – Display all transactions in a formatted table
- **View Balance Summary** – See total income, total expense, and current balance
- **Delete Transaction** – Remove a transaction by its number
- **Persistent Storage** – All data is stored in `transactions.csv`
- **Input Validation** – Guards against empty descriptions, invalid amounts, and NaN/infinity values

## Requirements

- Python 3.6 or higher
- No external libraries required (uses only the Python standard library)

## How to Run

1. Open a terminal in the `Money_Notepad` folder.

2. Run the program:
   ```bash
   python money_notepad.py
   ```

3. Follow the on-screen menu to manage your money.

## Menu Options

```
===== MONEY NOTEPAD =====
1. Add Income
2. Add Expense
3. View Transactions
4. View Balance Summary
5. Delete Transaction
6. Exit
```

## Project Structure

```
Money_Notepad/
├── money_notepad.py    # Main application
├── transactions.csv    # Data file (created automatically on first save)
└── README.md
```

## Data Format

Transactions are stored in `transactions.csv` with the following fields:

| Field       | Description                          |
|-------------|--------------------------------------|
| date        | Date of the transaction (YYYY-MM-DD) |
| type        | `income` or `expense`                |
| description | Short note about the transaction     |
| amount      | Amount as a positive number          |

## Example Usage

```
Choose an option (1-6): 1
Enter description: Freelance payment
Enter amount: 1500
Income of 1500.00 added.

Choose an option (1-6): 2
Enter description: Groceries
Enter amount: 320.50
Expense of 320.50 added.

Choose an option (1-6): 3

No.   Date         Type       Description               Amount
--------------------------------------------------------------------
1     2026-09-29   income     Freelance payment        1500.00
2     2026-09-29   expense    Groceries                 320.50

Choose an option (1-6): 4

----- Summary -----
Total Income : 1500.00
Total Expense: 320.50
Balance      : 1179.50
```

## Screenshots

> Add your terminal screenshots here after running the program (main menu, add income, view transactions, balance summary, etc.).
>
> Suggested filenames:
> - `ss_00_main_menu.png`
> - `ss_01_add_income.png`
> - `ss_02_view_transactions.png`
> - `ss_03_balance_summary.png`

## Notes

- The CSV file (`transactions.csv`) is created automatically when you add the first transaction.
- Amounts must be greater than zero.
- Balance = Total Income − Total Expense.
- Press `Ctrl+C` or choose option 6 to exit; your data is saved on every change.
