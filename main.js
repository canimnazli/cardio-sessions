//added comment to try merge with another branch at the same time with edits on both
//book class: represents a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI class: user interface handle ui tasks,
//display book, add book, remove book, show alert
class UI {
  static dislplayBook() {
    const books = Store.getBooks();

    books.forEach(book => UI.addBookToList(book));
  }
  static addBookToList(book) {
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">X </a></td>
    `;
    list.append(row);
  }
  static deleteBook(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.append(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    //vanish after 3 sec
    //curly braces olunca çalışmıyor
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
}

//store class: takes care of storage within the browser
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books')); //json parse yapmamızın sebebi localden data string geliyor array of object e ceviriyoruz
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

//events: display books show the list
document.addEventListener('DOMContentLoaded', UI.dislplayBook);

//add a book event
document.querySelector('#book-form').addEventListener('submit', e => {
  // prevent actual submit
  e.preventDefault();

  //get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  //validate user input
  if (title === '' || author === '' || isbn === '') {
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
    //instantiate book yani js hafızasında oluşuyor ama ekrana yazmıyor
    const book = new Book(title, author, isbn);
    console.log(book);

    //add book to screen
    UI.addBookToList(book);

    //add book to store
    Store.addBook(book);

    //show success message
    UI.showAlert('Book added', 'success');

    //clear fields
    UI.clearFields();
  }
});

//remove a book event
document.querySelector('#book-list').addEventListener('click', e => {
  UI.deleteBook(e.target);

  //remove from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //show delete message
  UI.showAlert('Book deleted', 'danger');
});

//try another branch
