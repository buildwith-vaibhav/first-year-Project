import os
import csv
from datetime import datetime,timedelta
file1="library.csv"
fields=["ISBN",'Title','Author',"Status","IssueDate","DueDate"]

#file handling
def load_book():
    if not os.path.exists(file1):
        return[]
    with open(file1,"r", newline="") as f:
        read=csv.DictReader(f)
        return list(read)
    
#save books
def save_books(books):
    with open(file1,"w", newline="") as f:
        writer=csv.DictWriter(f,fieldnames=fields)
        writer.writeheader()
        writer.writerows(books)
    
 #Add book
def add_book():
    books=load_book()
    
    isbn=input("Enter The ISBN of Book:").strip()
    
    #to avoid duplicate books
    for b in books:
        if b["ISBN"]==isbn:
            print("A book with this ISBN already exist.\n")
            return
        
    title=input("Enter The Book Title").strip()
    author=input("Enter The Book Author").strip()
        
    new_book={
        "ISBN":isbn,
        "Title": title,
        "Author": author,
        "Status":"Available",
        "IssueDate":"",
        "DueDate":""
    }
    books.append(new_book)
    save_books(books)
    
#to view all books
def view_all():
    books=load_book()
    if not books:
        print("NO books in the library yet.\n)")
        return
    
    print(f"\n{"ISBN":<12}{"Title":<25}{'Author':<12}{"Status":<12}{"DueDate"}")
    print("-"*80)
    for b in books:
        print(f"\n{b["ISBN"]:<12}{b["Title"]:<25}{b['Author']:<12}{b["Status"]:<12}{b["DueDate"]}")
        print()

#to search
def search():
    books=load_book()
    query=input("Enter title or author to reserch:").strip().lower()
    result=False
    for b in books:
        if query in b["Title"].lower() or query in b['Author'].lower():
            print(f"{b['Title']} by {b["Author"]} [{b["Status"]}]")
            print()
            result=True
    if not result:
        print("No matching books found.\n")
        return
    
#Issue 
Loan_days=5
def issue_book():
    book=load_book()
    isbn=input("Enter ISBN to Issue").strip()
    for b in book:
        if b["ISBN"]==isbn:
            if b["Status"]=="Issued":
                print("This book is already issued.\n")
                return
    
            
            today=datetime.now()
            due=today+timedelta(days=Loan_days)
            
            b["Status"]="Issued"
            b["IssueDate"]= today.strftime("%Y-%m-%d")
            b["DueDate"]=due.strftime("%Y-%m-%d")
            
            save_books(book)
            return
    print("No book found with the ISBN.\n")
#return book
fine_per_day=5
def return_books():
    books=load_book()
    isbn=input("Enter ISBN to return:").strip()
    
    for b in books:
        if b['ISBN']==isbn:
            if b["Status"]!="Issued":
                print("This Book was not issued.\n")
                return
            
            due_date=datetime.strptime(b["DueDate"],"%Y-%m-%d")
            today=datetime.now()
            
            fine=calculate_fine(due_date,today)
            
            b["Status"]="Available"
            b["IssueDate"]=""
            b["DueDate"]=""
            save_books(books)
            
            if fine>0:
                print(f"'{b['Title']}' returned.Late by{(today-due_date).days} day(s).Fine:Rs.{fine}\n")
                return
            else:
                print(f"'{b['Title']}' returned on time.No fine.\n")
                return
    print("No book found with that ISBN.\n")
        
def calculate_fine(due_date,return_date):
    days_late=(return_date-due_date).days
    if days_late>0:
        return days_late*fine_per_day
    return 0

#Menu

def main():
    while True:
        print("====LIBRARY MANAGEMENT SYSTEM====")
        print("1.Add Book")
        print("2.View All Book")
        print("3.Search Book")
        print("4.Issue Book")
        print("5.return Book")
        print("6.Exit")
        
        choice=input("Enter your choice(1-6):").strip()
        
        if choice=='1':
            add_book()
        elif choice=='2':
            view_all()
        elif choice=='3':
            search()
        elif choice=='4':
            issue_book()
        elif choice=='5':
            return_books()
        elif choice=='6':
            print("Goodbye!")
            break
        else:
            print("invbalid choice.please enter 1-6.\n")
            
if __name__=="__main__":
    main()