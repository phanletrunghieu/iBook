import localforage from 'localforage';
import uuidv1 from 'uuid/v1';
import {sync} from "../utils/helper";

const KEY_BOOK = 'list_books';

/**
 * Cấu trúc 1 sách
 * @property id {string} - id sách
 * @property drive_id {string} - id của file trên google drive
 * @property image {base64 string} - bìa sách
 * @property name {string} - tên sách
 * @property author {string} - tác giả sách
 * @property description {string} - mô tả
 * @property date_created {timestamp} - ngày tạo sách
 * @property date_modified {timestamp} - ngày chỉnh sách
 * @property status_id {int} - 1: mới tạo, 2: bị thay đổi nội dung, 3: xoá, 4: đã đồng bộ trên drive
 * @property chapters {array} - chứa các chapter {id, name, content}
 * @property is_share {bool} - đã share chưa
 * @property is_allow_copy {bool} - cho phép người khác copy
 */

/**
 * Xoá tất cả dữ liệu về sách
 */
 export function clearBookInfo() {
   localforage.removeItem(KEY_BOOK);
 }

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
export function setBooksData(list_books, is_sync=true) {
  return new Promise(function(resolve, reject) {
    localforage.setItem(KEY_BOOK, JSON.stringify(list_books))
    .then(()=>{
      if(is_sync){
        sync();
      }
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
      image: "/images/cover.jpg",
      name: name,
      author: "",
      description: "",
      chapters: [{
        id: uuidv1(),
        name: "Chapter 1",
        content: "",
      }],
      date_created: now,
      date_modified: now,
      is_share: false,
      is_allow_copy: false,
      status_id: 1,
    });

    return setBooksData(list_books);
  });
}

/**
 * Copy 1 sách của người khác
 */
export function cloneBook(book) {
  return getBooksData()
  .then(list_books=>{
    var now = Date.now();
    book.date_created = now;
    book.date_modified = now;
    book.status_id = 1;
    book.is_share = false;
    book.is_allow_copy = false;
    list_books.push(book);
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
export function editChapterContent(book_id, chapter_id, newChapterName, newContent) {
  return getBooksData()
  .then(list_books=>{
    var book_index = list_books.findIndex(book=>book.id.toString() === book_id.toString());
    var book = list_books[book_index];

    var chapter_index = book.chapters.findIndex(chapter=>chapter.id===chapter_id);

    list_books[book_index].chapters[chapter_index].content = newContent;
    list_books[book_index].chapters[chapter_index].name = newChapterName;

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
    list_books[book_index].chapters.splice(chapter_index, 1);

    if(list_books[book_index].status_id!==1)
      list_books[book_index].status_id = 2;

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

    if(list_books[index].status_id!==1)
      list_books[index].status_id = 2;

    return setBooksData(list_books);
  });
}

/**
 * enable/disable share book
 */
export function shareBook(book_id, is_share) {
  return getBooksData()
  .then(list_books=>{
    var index=list_books.findIndex(book=>book.id.toString() === book_id.toString());
    list_books[index].is_share = is_share;

    return setBooksData(list_books, false);
  });
}

/**
 * allow/disallow copy book
 */
export function allowCopyBook(book_id, is_allow_copy) {
  return getBooksData()
  .then(list_books=>{
    var index=list_books.findIndex(book=>book.id.toString() === book_id.toString());
    list_books[index].is_allow_copy = is_allow_copy;

    if(list_books[index].status_id!==1)
      list_books[index].status_id = 2;

    return setBooksData(list_books);
  });
}