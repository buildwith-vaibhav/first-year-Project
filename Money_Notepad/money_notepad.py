import csv
import os
from datetime import date

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILENAME = os.path.join(BASE_DIR, "transactions.csv")
FIELDS = ["date", "type", "description", "amount"]


def load_transactions():
    """Read transactions from the CSV file into a list of dictionaries."""
    transactions = []
    if not os.path.exists(FILENAME):
        return transactions

    with open(FILENAME, "r", newline="", encoding="utf-8") as file:
        for line_no, row in enumerate(csv.DictReader(file), start=2):
            try:
                transactions.append({
                    "date": row["date"],
                    "type": row["type"],
                    "desc": row["description"],
                    "amount": float(row["amount"]),
                })
            except (KeyError, ValueError, TypeError):
                print(f"Warning: skipped a damaged row (line {line_no}).")
    return transactions


def save_transactions(transactions):
    """Write all transactions to the CSV file."""
    with open(FILENAME, "w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=FIELDS)
        writer.writeheader()
        for t in transactions:
            writer.writerow({
                "date": t["date"],
                "type": t["type"],
                "description": t["desc"],
                "amount": f"{t['amount']:.2f}",
            })


def add_transaction(transactions, kind):
    """Ask the user for details and add a new transaction."""
    while True:
        desc = input("Enter description: ").strip()
        if desc:
            break
        print("Description cannot be empty.")

    while True:
        try:
            amount = float(input("Enter amount: ").strip())
        except ValueError:
            print("Please enter a valid number.")
            continue
        if amount <= 0 or amount != amount or amount == float("inf"):
            print("Amount must be greater than zero.")
            continue
        break

    transactions.append({
        "date": date.today().isoformat(),
        "type": kind,
        "desc": desc,
        "amount": round(amount, 2),
    })
    save_transactions(transactions)
    print(f"{kind.capitalize()} of {amount:.2f} added.\n")


def view_transactions(transactions):
    """Print all recorded transactions."""
    if not transactions:
        print("No transactions recorded yet.\n")
        return

    print("\n{:<5} {:<12} {:<10} {:<25} {:>12}".format(
        "No.", "Date", "Type", "Description", "Amount"))
    print("-" * 68)
    for i, t in enumerate(transactions, start=1):
        desc = t["desc"] if len(t["desc"]) <= 25 else t["desc"][:22] + "..."
        print("{:<5} {:<12} {:<10} {:<25} {:>12.2f}".format(
            i, t["date"], t["type"], desc, t["amount"]))
    print()


def calculate_balance(transactions):
    """Calculate total income, total expense, and balance."""
    income = sum(t["amount"] for t in transactions if t["type"] == "income")
    expense = sum(t["amount"] for t in transactions if t["type"] == "expense")
    return income, expense, income - expense


def show_balance(transactions):
    """Print income, expense, and balance summary."""
    income, expense, balance = calculate_balance(transactions)
    print("\n----- Summary -----")
    print(f"Total Income : {income:.2f}")
    print(f"Total Expense: {expense:.2f}")
    print(f"Balance      : {balance:.2f}\n")


def delete_transaction(transactions):
    """Delete a transaction by its number."""
    if not transactions:
        print("No transactions recorded yet.\n")
        return

    view_transactions(transactions)
    try:
        num = int(input("Enter transaction number to delete (0 to cancel): "))
    except ValueError:
        print("Please enter a valid number.\n")
        return

    if num == 0:
        print("Cancelled.\n")
    elif 1 <= num <= len(transactions):
        removed = transactions.pop(num - 1)
        save_transactions(transactions)
        print(f"Deleted: {removed['type']} - {removed['desc']} - {removed['amount']:.2f}\n")
    else:
        print("Invalid transaction number.\n")


def show_menu():
    """Display the main menu."""
    print("===== MONEY NOTEPAD =====")
    print("1. Add Income")
    print("2. Add Expense")
    print("3. View Transactions")
    print("4. View Balance Summary")
    print("5. Delete Transaction")
    print("6. Exit")


def main():
    """Main program loop."""
    transactions = load_transactions()

    try:
        while True:
            show_menu()
            choice = input("Choose an option (1-6): ").strip()

            if choice == "1":
                add_transaction(transactions, "income")
            elif choice == "2":
                add_transaction(transactions, "expense")
            elif choice == "3":
                view_transactions(transactions)
            elif choice == "4":
                show_balance(transactions)
            elif choice == "5":
                delete_transaction(transactions)
            elif choice == "6":
                print("Goodbye! Your transactions are saved in", FILENAME)
                break
            else:
                print("Invalid choice. Please choose between 1 and 6.\n")
    except (KeyboardInterrupt, EOFError):
        print("\nGoodbye!")


if __name__ == "__main__":
    main()
