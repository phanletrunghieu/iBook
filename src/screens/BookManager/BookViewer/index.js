import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';

import SortIcon from 'material-ui/svg-icons/content/sort';

import {getChapterByID, getBookByID} from "../../../api/BookAPI";

class BookViewerScreen extends Component {

  state={
    deviceWidth: 0,
    selectChapterId: 0,
    snackbarMessage: "",
  };

  constructor(props){
    super(props);

    this.updateDimensions = this.updateDimensions.bind(this);
    this.loadData = this.loadData.bind(this);
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
    setInterval(this.intervalAutoSave);
  }
  updateDimensions() {
    this.setState({deviceWidth: window.innerWidth});
  }

  loadData() {
    var bookId = this.props.match.params.bookId;
    getBookByID(bookId)
    .then(book=>{
      if(!book){
        return Promise.reject("Book was not found");
      }

      this.setState(book);
    })
    .catch(err=>this.setState({snackbarMessage: err.message || err}));
  }

  render() {
    var is_desktop = this.state.deviceWidth >= 992;

    var styles={
      container: {
        backgroundColor: "#ccc",
        padding: is_desktop ? "10px 10%" : "0",
      },
      chapterName: {
        textAlign: "center",
        fontSize: 25,
        fontWeight: "700",
        padding: "20px 0",
      },
      content: {
        height: 1000,
        backgroundColor: "#fff",
        padding: "50px 10px",
      },
      floatingActionButton: {
        position: 'fixed',
        bottom: 15,
        right: 15,
      },
      dialogContentStyle: {
        width: 350,
        maxWidth: 'none',
      },
    };

    return (
      <div className="book-viewer-screen">
        <div style={styles.container}>
          <div style={styles.chapterName}>
            {
              this.state.chapters ?
              this.state.chapters[this.state.selectChapterId].name
              : null
            }
          </div>
          {
            this.state.chapters ?
            <div style={styles.content} dangerouslySetInnerHTML={{__html: this.state.chapters[this.state.selectChapterId].content}}/>
            : null
          }
        </div>

        <FloatingActionButton
          style={styles.floatingActionButton}
          onClick={()=>this.setState({openChapterDialog: true})}
        >
          <SortIcon/>
        </FloatingActionButton>

        <Dialog
          title="Choose a chapter"
          modal={false}
          contentStyle={styles.dialogContentStyle}
          onRequestClose={()=>this.setState({openChapterDialog: false})}
          autoScrollBodyContent={true}
          open={this.state.openChapterDialog}
        >
          <List>
            {
              this.state.chapters ?
              this.state.chapters.map((chapter, index)=>(
                <ListItem
                  key={index}
                  primaryText={chapter.name}
                  onClick={()=>this.setState({
                    openChapterDialog: false,
                    selectChapterId: index,
                  })}
                />
              ))
              : null
            }
          </List>
        </Dialog>

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

export default BookViewerScreen;
