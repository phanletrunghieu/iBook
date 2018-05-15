import localforage from 'localforage';
import uuidv1 from 'uuid/v1';
import {sync} from "../utils/helper";

const KEY_BOOK = 'list_books';

/**
 * Cấu trúc 1 sách
 * @property id {string} - id sách (nếu đã được đồng bộ ? current_timestamp : google drive id)
 * @property image {base64 string} - bìa sách
 * @property name {string} - tên sách
 * @property author {string} - tác giả sách
 * @property description {string} - mô tả
 * @property date_created {timestamp} - ngày tạo sách
 * @property date_modified {timestamp} - ngày chỉnh sách
 * @property status_id {int} - 1: mới tạo, 2: bị thay đổi nội dung, 3: xoá, 4: đã đồng bộ trên drive, 5: đổi tên, 6: đổi bìa sách
 * @property chapters {array} - chứa các chapter {id, name, content}
 */


/**
 * Lấy tất cả sách
 */
export function getBooksData(){
  return new Promise(function(resolve, reject) {
    localforage.getItem(KEY_BOOK)
    .then(list_books=>{
      list_books = JSON.parse(list_books) || [];
      list_books = list_books.filter(book=>book.status_id !== 3)
      resolve(list_books);
    })
    .catch(err=>reject(err));
  });
}

/**
 * Lấy sách theo id
 */
export function getBookByID(book_id) {
  return new Promise(function(resolve, reject) {
    getBooksData()
    .then(list_books=>{
      var books = list_books.filter(book=>book.id.toString() === book_id.toString());
      if(books.length <= 0){
        resolve(null);
      } else {
        resolve(books[0]);
      }
    })
    .catch(err=>reject(err));
  });
}
/**
 * Lấy chuơng theo BookId, ChapterId
 */
export function getChapterByID(book_id, chapter_id) {
  return new Promise(function(resolve, reject) {
    getBooksData()
    .then(list_books=>{
      var books = list_books.filter(book=>book.id.toString() === book_id.toString());
      var chapters = books[0].chapters.filter(chapter=>chapter.id.toString() === chapter_id.toString())
      if(chapters.length <= 0){
        resolve(null);
      } else {
        resolve(chapters[0]);
      }
    })
    .catch(err=>reject(err));
  });
}

/**
 * Lưu dữ liệu
 */
export function setBooksData(list_books) {
  return new Promise(function(resolve, reject) {
    localforage.setItem(KEY_BOOK, JSON.stringify(list_books))
    .then(()=>{
      sync();
      resolve();
    })
    .catch(err=>reject(err));
  });
}

/**
 * Thêm 1 sách
 */
export function addBook(name) {
  return getBooksData()
  .then(list_books=>{
    var now = Date.now();

    list_books.push({
      id: uuidv1(),
      image: "https://about.canva.com/wp-content/uploads/sites/3/2015/01/children_bookcover.png",
      name: name,
      author: "",
      chapters: [{
        id: uuidv1(),
        name: "Chapter 1",
        content: "",
      }],
      date_created: now,
      date_modified: now,
      status_id: 1,
    });

    return setBooksData(list_books);
  });
}

/**
 * Xoá 1 sách
 */
export function deleteBook(book_id) {
  return getBooksData()
  .then(list_books=>{
    var index=list_books.findIndex(book=>book.id.toString() === book_id.toString());
    list_books[index].status_id = 3;

    return setBooksData(list_books);
  });
}

/**
 * Thêm 1 chapter mới
 */
export function addChapter(book_id, chapter_name) {
  return getBooksData()
  .then(list_books=>{
    var book_index = list_books.findIndex(book=>book.id === book_id);

    list_books[book_index].chapters.push({
      id: uuidv1(),
      name: chapter_name,
      content: "",
    });

    list_books[book_index].date_modified = Date.now();
    if(list_books[book_index].status_id!==1)
      list_books[book_index].status_id = 2;

    return setBooksData(list_books);
  });
}

/**
 * Thay đổi tên chapter
 */
export function editChapterName(book_id, chapter_id, chapter_name) {
  return getBooksData()
  .then(list_books=>{
    var book_index = list_books.findIndex(book=>book.id === book_id);
    var book = list_books[book_index];

    var chapter_index = book.chapters.findIndex(chapter=>chapter.id === chapter_id);

    list_books[book_index].chapters[chapter_index].name = chapter_name;

    list_books[book_index].date_modified = Date.now();
    if(list_books[book_index].status_id!==1)
      list_books[book_index].status_id = 2;

    return setBooksData(list_books);
  });
}

/**
 * Chỉnh sửa nội dung của 1 chapter trong sách
 */
export function editChapterContent(book_id, chapter_id, newContent) {
  return getBooksData()
  .then(list_books=>{
    var book_index = list_books.findIndex(book=>book.id.toString() === book_id.toString());
    var book = list_books[book_index];

    var chapter_index = book.chapters.findIndex(chapter=>chapter.id===chapter_id);

    list_books[book_index].chapters[chapter_index].content = newContent;

    list_books[book_index].date_modified = Date.now();
    if(list_books[book_index].status_id!==1)
      list_books[book_index].status_id = 2;

    return setBooksData(list_books);
  });
}

export function deleteChapter(book_id, chapter_id) {
  return getBooksData()
  .then(list_books=>{
    var book_index = list_books.findIndex(book=>book.id.toString() === book_id.toString());
    var book = list_books[book_index];

    var chapter_index = book.chapters.findIndex(chapter=>chapter.id===chapter_id);

    list_books[book_index].date_modified = Date.now();
    list_books[book_index].chapters.splice(chapter_index - 1, 1);

    return setBooksData(list_books);
  });
}

/**
 * Cập nhật sách
 */
export function updateBook(book_id, new_data) {
  return getBooksData()
  .then(list_books=>{
    var index=list_books.findIndex(book=>book.id.toString() === book_id.toString());
    list_books[index] = new_data;
    list_books[index].status_id = 2;

    return setBooksData(list_books);
  });
}

/**
 * Đổi tên sách
 */
export function editBookName(book_id, new_name) {
  return getBooksData()
  .then(list_books=>{
    var index=list_books.findIndex(book=>book.id.toString() === book_id.toString());
    list_books[index].name = new_name;
    list_books[index].status_id = 5;

    return setBooksData(list_books);
  });
}

/**
 * Đổi bìa sách
 */
export function editBookCover(book_id, new_image) {
  return getBooksData()
  .then(list_books=>{
    var index=list_books.findIndex(book=>book.id.toString() === book_id.toString());
    list_books[index].image = new_image;
    list_books[index].status_id = 6;

    return setBooksData(list_books);
  });
}

/**
 * Đổi tên tác giả
 */
export function editBookAuthor(book_id, new_author) {
  return getBooksData()
  .then(list_books=>{
    var index=list_books.findIndex(book=>book.id.toString() === book_id.toString());
    list_books[index].author = new_author;
    list_books[index].status_id = 2;

    return setBooksData(list_books);
  });
}

/**
 * Đổi tên tác giả
 */
export function editBookDescription(book_id, new_description) {
  return getBooksData()
  .then(list_books=>{
    var index=list_books.findIndex(book=>book.id.toString() === book_id.toString());
    list_books[index].description = new_description;
    list_books[index].status_id = 2;

    return setBooksData(list_books);
  });
}
