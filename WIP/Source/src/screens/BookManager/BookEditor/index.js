import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import AppBar from 'material-ui/AppBar';

import SaveIcon from 'material-ui/svg-icons/content/save';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import VisibilityIcon from 'material-ui/svg-icons/action/visibility';

import MyEditor from "../../../components/CKEditor";

import {getBookByID, getChapterByID, editChapterContent} from "../../../api/BookAPI";
import {getTimeAutoSave, setTimeAutoSave, getTimeAutoSync, setTimeAutoSync} from "../../../api/SettingAPI";

import browserHistory from "../../../utils/browserHistory";

import "./BookEditor.css"

class BookEditorScreen extends Component {

  state={
    book: {},
    chapter: {},
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
    });

    getBookByID(bookId)
    .then(book => {
      this.setState({book});
    });
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
        textAlign: 'center'
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
        <AppBar
          title={this.state.book.name + " - " + this.state.chapter.name}
          //onTitleClick={handleClick}
          style={{position: 'fixed', top: 0}}
          iconElementLeft={
            <IconButton onClick={browserHistory.goBack}>
              <ArrowBackIcon />
            </IconButton>
          }
          iconElementRight={
            <div>
              <IconButton onClick={()=>browserHistory.push("/book/"+this.props.match.params.bookId+"/"+this.props.match.params.chapterId)}><VisibilityIcon color="white" /></IconButton>
              <IconMenu
                iconButtonElement={
                  <IconButton><MoreVertIcon color="white" /></IconButton>
                }
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              >
                <MenuItem primaryText="Refresh" onClick={() => window.location.reload()} />
                <MenuItem primaryText="Help" />
              </IconMenu>
            </div>
          }
        />
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
