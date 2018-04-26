import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';

import SaveIcon from 'material-ui/svg-icons/content/save';

import {getBookByID, editContent} from "../../../api/BookAPI";

class BookEditorScreen extends Component {

  state={
    deviceWidth: 0,
    book: {},
  };

  constructor(props){
    super(props);

    this.updateDimensions = this.updateDimensions.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handleChangeBookContent = this.handleChangeBookContent.bind(this);
    this.save = this.save.bind(this);
  }

  componentWillMount() {
    this.updateDimensions();
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    this.loadData();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }
  updateDimensions(){
    this.setState({deviceWidth: window.innerWidth});
  }

  loadData(){
    getBookByID(this.props.match.params.bookId)
    .then(book=>{
      this.setState({book});
    });
  }

  handleChangeBookContent(value){
    var book = this.state.book;
    book.content = value;
    this.setState({book});
  }

  save(){
    console.log(this.state.book);
    editContent(this.state.book.id, this.state.book.content)
    .then(()=>{
      console.log("Đã lưu");
    })
  }

  render() {
    var styles={
      floatingActionButton: {
        position: 'fixed',
        bottom: 15,
        right: 15,
      },
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
        <ReactQuill
          modules={reactQuillModules}
          value={this.state.book.content}
          onChange={value=>this.handleChangeBookContent(value)}
          style={{height: "calc(100vh - 110px)"}}
        />
        {
          this.state.deviceWidth >= 992 ?
          <RaisedButton
            label="Save"
            primary={true}
            icon={<SaveIcon />}
            style={styles.floatingActionButton}
            onClick={this.save}
          />
          :
          <FloatingActionButton
            style={styles.floatingActionButton}
            onClick={this.save}
          >
            <SaveIcon/>
          </FloatingActionButton>
        }
      </div>
    );
  }
}

export default BookEditorScreen;
