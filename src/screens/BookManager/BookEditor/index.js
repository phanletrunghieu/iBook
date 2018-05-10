import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';

import SaveIcon from 'material-ui/svg-icons/content/save';

import {getChapterByID, editChapterContent} from "../../../api/BookAPI";

class BookEditorScreen extends Component {

  state={
    deviceWidth: 0,
    chapter: {},
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
  updateDimensions() {
    this.setState({deviceWidth: window.innerWidth});
  }

  loadData() {
    var bookId = this.props.match.params.bookId;
    var chapterId = this.props.match.params.chapterId;
    getChapterByID(bookId, chapterId)
    .then(chapter => {
      this.setState({chapter});
    })
  }

  handleChangeBookContent(value){
    var chapter = this.state.chapter;
    chapter.content = value;
    this.setState({chapter});
  }

  save(){
    this.setState({chapter: this.state.chapter})
    editChapterContent(this.props.match.params.bookId, this.props.match.params.chapterId, this.state.chapter.content)
    .then(()=>{
      console.log("Đã lưu");
      this.props.history.goBack();
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
          value={this.state.chapter.content}
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
