import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';

import SaveIcon from 'material-ui/svg-icons/content/save';

import MyEditor from "../../../components/CKEditor";

import {getChapterByID, editChapterContent} from "../../../api/BookAPI";
import {getTimeAutoSave, setTimeAutoSave, getTimeAutoSync, setTimeAutoSync} from "../../../api/SettingAPI";

import "./BookEditor.css"

class BookEditorScreen extends Component {

  state={
    deviceWidth: 0,
    chapter: {},
    snackbarMessage: "",
  };

  constructor(props){
    super(props);

    this.updateDimensions = this.updateDimensions.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handleChangeBookContent = this.handleChangeBookContent.bind(this);
    this.save = this.save.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.handleChangeChapterName = this.handleChangeChapterName.bind(this);
  }

  componentWillMount() {
    this.updateDimensions();
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    this.loadData();

    //auto Save
    var that = this
    this.intervalAutoSave=setInterval(function () {
      that.save()
      .then(()=>{
        that.setState({snackbarMessage: "Auto save"});
      })
    }, getTimeAutoSave()*60*1000);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);

    //clearInterval autosave
    clearInterval(this.intervalAutoSave);
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

  handleChangeChapterName(event) {
    var chapter = this.state.chapter;
    chapter.name = event.target.value;
    this.setState({chapter});
  }

  save(){
    console.log("save");
    return editChapterContent(this.props.match.params.bookId, this.props.match.params.chapterId, this.state.chapter.name, this.state.chapter.content);
  }

  onClickSave(){
    this.save()
    .then(()=>{
      this.setState({snackbarMessage: "Saved"});
      this.props.history.goBack();
    });
  }

  render() {

    var is_desktop = this.state.deviceWidth >= 992;

    var styles={
      container: {
        backgroundColor: "#ccc",
      },

      titleField: {
        backgroundColor: 'white',
        marginBottom: 10,
        'text-align': 'center'
      },

      floatingActionButton: {
        position: 'fixed',
        bottom: 15,
        right: 15,
        zIndex: 100,
      },
    };

    return (
      <div style={styles.container} className="book-editor-screen">
        <div style={{paddingLeft:20, paddingRight: 20, backgroundColor: 'white', marginTop:10,}}>
          <TextField
            style={styles.titleField}
            value={this.state.chapter.name}
            floatingLabelText="Chapter's name"
            floatingLabelFixed={true}
            fullWidth
            onChange={event=>this.handleChangeChapterName(event)}
          />
        </div>
        <MyEditor
          content={this.state.chapter.content}
          onChange={value=>this.handleChangeBookContent(value)}
        />
        {
          this.state.deviceWidth >= 992 ?
          <RaisedButton
            label="Save"
            primary={true}
            icon={<SaveIcon />}
            style={styles.floatingActionButton}
            onClick={this.onClickSave}
          />
          :
          <FloatingActionButton
            style={styles.floatingActionButton}
            onClick={this.onClickSave}
          >
            <SaveIcon/>
          </FloatingActionButton>
        }

        <Snackbar
          open={this.state.snackbarMessage !== ""}
          message={this.state.snackbarMessage}
          autoHideDuration={4000}
          onRequestClose={()=>this.setState({snackbarMessage: ""})}
          bodyStyle={{textAlign: "center"}}
        />
      </div>
    );
  }
}

export default BookEditorScreen;
