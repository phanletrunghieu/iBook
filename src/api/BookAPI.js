import localforage from 'localforage';

const KEY_BOOK = 'list_books';

/**
 * Cấu trúc 1 sách
 * @property id {string} - id sách (nếu đã được đồng bộ ? current_timestamp : google drive id)
 * @property name {string} - tên sách
 * @property content {string} - nội dung sách (lưu dạng html)
 * @property status_id {int} - 1: mới tạo, 2: bị thay đổi nội dung, 3: xoá, 4: đã đồng bộ trên drive
 */

export function getBooksData(){
  return new Promise(function(resolve, reject) {
    localforage.getItem(KEY_BOOK)
    .then(list_books=>{
      resolve(JSON.parse(list_books) || []);
    })
    .catch(err=>reject(err));
  });
}

export function getBookByID(bookId) {
  return new Promise(function(resolve, reject) {
    getBooksData()
    .then(list_books=>{
      var books = list_books.filter(book=>book.id === bookId);
      if(books.length <= 0){
        resolve(null);
      } else {
        resolve(books[0]);
      }
    })
    .catch(err=>reject(err));
  });
}

export function setBooksData(list_books) {
  return localforage.setItem(KEY_BOOK, JSON.stringify(list_books));
}

export function addBook(name, content="") {
  return getBooksData()
  .then(list_books=>{
    list_books.push({
      id: Date.now(),
      name: name,
      content: content,
      status_id: 1,
    });

    return setBooksData(list_books);
  });
}

export function deleteBook(id) {
  return getBooksData()
  .then(list_books=>{
    var index=list_books.indexOf(book=>book.id!==id);
    list_books[index].status_id = 3;

    return setBooksData(list_books);
  });
}

export function editContent(id, newContent) {
  return getBooksData()
  .then(list_books=>{
    var index=list_books.indexOf(book=>book.id!==id);
    list_books[index].content = newContent;
    list_books[index].status_id = 2;

    return setBooksData(list_books);
  });
}
