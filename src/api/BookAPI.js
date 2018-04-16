const KEY_BOOK = 'list_books';

export function getBooksData(){
  return JSON.parse(localStorage.getItem(KEY_BOOK)) || [];
}

export function setBooksData(list_books) {
  localStorage.setItem(KEY_BOOK, JSON.stringify(list_books));
}

export function addBook(id, name, content) {
  var list_books = getBooksData();
  list_books.push({
    id: id,
    name: name,
    content: content,
  });
  setBooksData(list_books);
}

export function deleteBook(id) {
  var list_books = getBooksData();
  list_books=list_books.filter(book=>book.id!==id);
  setBooksData(list_books);
}
