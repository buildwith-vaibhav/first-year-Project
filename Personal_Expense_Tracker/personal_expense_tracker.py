import csv
import json
import os
from datetime import datetime

DATA_FILE = "expenses.json"
CSV_FILE = "expenses_export.csv"
CATEGORIES = ["Food", "Travel", "Shopping", "Bills", "Education", "Other"]


def load_expenses():
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, "r") as file:
            return json.load(file)
    except (json.JSONDecodeError, OSError):
        print("Warning: data file could not be read. Starting fresh.")
        return []


def save_expenses(expenses):
    with open(DATA_FILE, "w") as file:
        json.dump(expenses, file, indent=4)


def get_amount():
    while True:
        try:
            amt = float(input("Amount (Rs.): "))
            if amt <= 0:
                print("Amount must be greater than 0.")
                continue
            return round(amt, 2)
        except ValueError:
            print("Please enter a valid number.")


def get_date():
    while True:
        text = input("Date (YYYY-MM-DD, press Enter for today): ").strip()
        if text == "":
            return datetime.today().strftime("%Y-%m-%d")
        try:
            datetime.strptime(text, "%Y-%m-%d")
            return text
        except ValueError:
            print("Invalid date. Use the format YYYY-MM-DD.")


def choose_category():
    print("Categories:")
    for number, name in enumerate(CATEGORIES, start=1):
        print(f"  {number}. {name}")
    while True:
        ch = input("Choose category number: ").strip()
        if ch.isdigit() and 1 <= int(ch) <= len(CATEGORIES):
            return CATEGORIES[int(ch) - 1]
        print("Invalid choice. Try again.")


def add_expense(expenses):
    print("\n--- Add Expense ---")
    amt = get_amount()
    category = choose_category()
    date = get_date()
    note = input("Note (optional): ").strip()

    new_id = max((e["id"] for e in expenses), default=0) + 1
    expenses.append(
        {"id": new_id, "amount": amt, "category": category,
         "date": date, "note": note}
    )
    save_expenses(expenses)
    print(f"Expense added with ID {new_id}.")


def print_table(rows):
    if not rows:
        print("No expenses found.")
        return
    print(f"\n{'ID':<5}{'Date':<12}{'Category':<12}{'Amount':>10}  Note")
    print("-" * 55)
    for e in rows:
        print(f"{e['id']:<5}{e['date']:<12}{e['category']:<12}"
              f"{e['amount']:>10.2f}  {e['note']}")
    print("-" * 55)
    print(f"Total: Rs. {sum(e['amount'] for e in rows):.2f}")


def view_expenses(expenses):
    print("\n--- All Expenses ---")
    print_table(sorted(expenses, key=lambda e: e["date"]))


def search_by_category(expenses):
    print("\n--- Search by Category ---")
    category = choose_category()
    print_table([e for e in expenses if e["category"] == category])


def delete_expense(expenses):
    print("\n--- Delete Expense ---")
    view_expenses(expenses)
    if not expenses:
        return
    choice = input("Enter ID to delete: ").strip()
    if not choice.isdigit():
        print("Invalid ID.")
        return
    target = int(choice)
    for e in expenses:
        if e["id"] == target:
            expenses.remove(e)
            save_expenses(expenses)
            print("Expense deleted.")
            return
    print("No expense found with that ID.")


def summary_report(expenses):
    print("\n--- Summary Report ---")
    if not expenses:
        print("No data to summarise yet.")
        return

    by_category = {}
    by_month = {}
    for e in expenses:
        by_category[e["category"]] = by_category.get(e["category"], 0) + e["amount"]
        month = e["date"][:7]
        by_month[month] = by_month.get(month, 0) + e["amount"]

    total = sum(e["amount"] for e in expenses)
    print(f"Total spent : Rs. {total:.2f}")
    print(f"Entries     : {len(expenses)}")
    print(f"Average     : Rs. {total / len(expenses):.2f}")

    print("\nBy category:")
    for name, amt in sorted(by_category.items(), key=lambda x: x[1], reverse=True):
        print(f"  {name:<12} Rs. {amt:>9.2f}  ({amt / total * 100:.1f}%)")

    print("\nBy month:")
    for month in sorted(by_month):
        print(f"  {month}   Rs. {by_month[month]:>9.2f}")


def export_csv(expenses):
    if not expenses:
        print("Nothing to export.")
        return
    with open(CSV_FILE, "w", newline="") as file:
        writer = csv.DictWriter(
            file, fieldnames=["id", "date", "category", "amount", "note"]
        )
        writer.writeheader()
        writer.writerows(sorted(expenses, key=lambda e: e["date"]))
    print(f"Exported {len(expenses)} entries to {CSV_FILE}")


def main():
    expenses = load_expenses()
    actions = {
        "1": add_expense,
        "2": view_expenses,
        "3": search_by_category,
        "4": delete_expense,
        "5": summary_report,
        "6": export_csv,
    }

    print("=" * 40)
    print("   PERSONAL EXPENSE TRACKER")
    print("=" * 40)

    while True:
        print("\n1. Add expense")
        print("2. View all expenses")
        print("3. Search by category")
        print("4. Delete expense")
        print("5. Summary report")
        print("6. Export to CSV")
        print("7. Exit")
        ch = input("Enter your choice (1-7): ").strip()

        if ch == "7":
            print("Goodbye! Your data has been saved.")
            break
        elif ch in actions:
            actions[ch](expenses)
        else:
            print("Invalid choice. Please enter a number from 1 to 7.")


if __name__ == "__main__":
    main()
