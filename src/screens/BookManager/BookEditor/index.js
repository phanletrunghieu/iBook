import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'

import {getBookByID} from "../../../api/BookAPI";

class BookEditorScreen extends Component {

  state={
    book: {},
  };

  constructor(props){
    super(props);

    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData(){
    getBookByID(this.props.match.params.bookId)
    .then(book=>{
      this.setState({book});
    });
  }

  render() {
    var styles={
    };

    var reactQuillModules = {
      toolbar: [
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'header': 1 }, { 'header': 2 }],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'align': [] }],
        ['clean'],
      ],
    };

    return (
      <div>
        <div>{this.props.match.params.bookId}</div>
        <ReactQuill
          modules={reactQuillModules}
        />
      </div>
    );
  }
}

export default BookEditorScreen;
