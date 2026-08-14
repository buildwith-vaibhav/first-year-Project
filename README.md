# Library Management System

A simple command-line Library Management System written in Python. It uses a CSV file for persistent storage and supports adding books, searching, issuing, returning, and calculating late fines.

## Features

- **Add Book** – Add a new book with ISBN, Title, and Author
- **View All Books** – Display all books in a formatted table
- **Search Book** – Search by title or author (case-insensitive)
- **Issue Book** – Issue a book with automatic due date calculation (5-day loan period)
- **Return Book** – Return a book and calculate late fine (₹5 per day)
- **Duplicate Prevention** – Prevents adding books with existing ISBNs
- **Persistent Storage** – All data is stored in `library.csv`

## Requirements

- Python 3.6 or higher
- No external libraries required (uses only Python standard library)

## How to Run

1. Clone the repository or download the files:

2. Run the program:
   ```bash
   python Library_Database.py
   ```

3. Follow the on-screen menu to interact with the system.

## Menu Options

```
====LIBRARY MANAGEMENT SYSTEM====
1. Add Book
2. View All Book
3. Search Book
4. Issue Book
5. Return Book
6. Exit
```

## Project Structure

```
.
├── Library_Database.py   # Main application
├── library.csv           # Data file (created automatically)
└── README.md
```

## Data Format

Books are stored in `library.csv` with the following fields:

| Field      | Description                          |
|------------|--------------------------------------|
| ISBN       | Unique book identifier               |
| Title      | Book title                           |
| Author     | Author name                          |
| Status     | `Available` or `Issued`              |
| IssueDate  | Date the book was issued (YYYY-MM-DD)|
| DueDate    | Due date for return (YYYY-MM-DD)     |

## Fine Calculation

- Loan period: **5 days**
- Fine: **₹5 per day** after the due date
- Fine is calculated automatically when a book is returned

## Example Usage

```
Enter your choice(1-6): 1
Enter The ISBN of Book: 978-0134685991
Enter The Book Title: Effective Python
Enter The Book Author: Brett Slatkin

Enter your choice(1-6): 4
Enter ISBN to Issue: 978-0134685991

Enter your choice(1-6): 5
Enter ISBN to return: 978-0134685991
'Effective Python' returned on time. No fine.
```

## Notes

- The CSV file (`library.csv`) is created automatically when you add the first book.
- ISBN must be unique.
- Only books with status `Available` can be issued.
- Only books with status `Issued` can be returned.


