import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
import Snackbar from 'material-ui/Snackbar';
import Avatar from 'material-ui/Avatar';
import Card from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import AddIcon from 'material-ui/svg-icons/content/add';

import ConfirmBox from "../../../components/ConfirmBox";

import browserHistory from "../../../utils/browserHistory";

import {addBook, getBooksData, deleteBook, shareBook, allowCopyBook} from "../../../api/BookAPI";
import GoogleDriveAPI from '../../../api/GoogleDriveAPI';
import {formatDate, getHomeUrl, copyTextToClipboard} from "../../../utils/helper"

import LinkDialog from './LinkDialog';

import BookDetailDialog from '../BookDetail';

class ListBookScreen extends Component {

  state={
    openDialog: false,
    newBookName: "",
    list_books: [],
    snackbarMessage: "",
  };

  constructor(props){
    super(props);

    this.updateDimensions = this.updateDimensions.bind(this);
    this.onAddNewBook = this.onAddNewBook.bind(this);
    this.loadData = this.loadData.bind(this);
    this.onShareBook = this.onShareBook.bind(this);
    this.onUnShareBook = this.onUnShareBook.bind(this);
    this.onAllowCopy = this.onAllowCopy.bind(this);
    this.onEditBook = this.onEditBook.bind(this);
    this.onViewBook = this.onViewBook.bind(this);
    this.onCopyLink = this.onCopyLink.bind(this);
    this.onEditInfoBook = this.onEditInfoBook.bind(this);
    this.onDeleteBook = this.onDeleteBook.bind(this);
  }

  componentDidMount() {
    this.loadData();

    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions();

    var that=this;
    setInterval(function () {
      that.loadData();
    }, 30*1000);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  loadData(){
    getBooksData()
    .then(list_books=>{
      this.setState({list_books});
    });
  }

  updateDimensions() {
    this.setState({deviceWidth: window.innerWidth});
  }

  onAddNewBook(){
    addBook(this.state.newBookName)
    .then(()=>{
      this.setState({
        openDialog: false,
        newBookName: "",
        snackbarMessage: "Book \"" + this.state.newBookName + "\"" + "successfully added to your list.",
      });

      this.loadData();
    })
    .catch(err=>{
      console.log("Error adding book.", err);
      this.setState({snackbarMessage: "Error adding book to your list."});
    });
  }

  onEditBook(book){
    browserHistory.push('/app/book/'+book.id);
  }

  onCopyLink(book){
    var url = getHomeUrl()+"/view/book/"+book.drive_id;
    copyTextToClipboard(url);
    this.LinkDialog.show(url);
  }

  onShareBook(book){
    if (!book.drive_id) {
      //nếu chưa đồng bộ
      return this.setState({snackbarMessage: "This book is not sync to server."});
    }

    GoogleDriveAPI.enableShare(book.drive_id)
    .then(()=>{
      //đánh dâu ở local là đã share
      return shareBook(book.id, true);
    })
    .then(bookdata=>{
      this.loadData();

      var url = getHomeUrl()+"/view/book/"+book.drive_id;
      copyTextToClipboard(url);
      this.setState({snackbarMessage: "Link is copied."});

      window.open(url, '_blank');
    })
    .catch(err=>{
      this.setState({snackbarMessage: "Fail."});
    });
  }

  onUnShareBook(book){
    if (!book.drive_id) {
      //nếu chưa đồng bộ
      return this.setState({snackbarMessage: "This book is not sync to server."});
    }

    GoogleDriveAPI.disableShare(book.drive_id)
    .then(()=>{
      //đánh dâu ở local là đã share
      return shareBook(book.id, false);
    })
    .then(bookdata=>{
      this.loadData();
      this.setState({snackbarMessage: "Disable share."});
    })
    .catch(err=>{
      this.setState({snackbarMessage: "Fail."});
    });
  }

  onAllowCopy(book, is_allow_copy){
    if (!book.drive_id) {
      //nếu chưa đồng bộ
      return this.setState({snackbarMessage: "This book is not sync to server."});
    }

    allowCopyBook(book.id, is_allow_copy)
    .then(()=>{
      this.loadData();
      this.setState({snackbarMessage: is_allow_copy ? "Allow copy." : "Not allow copy."});
    })
    .catch(err=>{
      this.setState({snackbarMessage: "Fail."});
    });
  }

  onViewBook(book){
    browserHistory.push('/book/'+book.id+'/'+book.chapters[0].id);
  }

  onEditInfoBook(book){
    // browserHistory.push('/app/book/'+book.id+'/detail');
    this.bookDetailDialog.show(book);
  }

  onShowConfirmDialog(book){
    this.confirmBoxDelete.setState({
      show: true,
      data: book,
      title: "Confirm",
      body: "Delete chapter \"" + book.name + "\"?",
    });
  }
  onDeleteBook(){
    var book = this.confirmBoxDelete.state.data;
    deleteBook(book.id)
    .then(()=>{
      this.setState({snackbarMessage: "\"" + book.name + "\" has been removed."});

      this.loadData();
    })
    .catch(err=>{
      console.log("Error removing book.", err);
      this.setState({snackbarMessage: "Error removing book from your list."});
    });
  }

  renderBookItem(book){
    var styles={
      listItem: {
        height: "auto",
      },
      listItemContainer: {
        paddingLeft: 170
      },
      bookTitle:{
        fontSize: "larger",
        paddingLeft: 10,
        paddingBottom: 3,
        lineHeight: 1,
        'display': 'block',
      },
      bookCover: {
        height: 225,
        width: 150,
      }
    };

    return(
      <ListItem
        key={book.id}
        style={styles.listItem}
        innerDivStyle={styles.listItemContainer}
        primaryText={<span style={styles.bookTitle}>{book.name}</span>}
        secondaryText={
          <div style={{height: 255, paddingLeft: 10, whiteSpace: 'unset'}}>
            <div style={{paddingBottom:5}}>{"Date created: " + formatDate((new Date(book.date_created)).toString())}</div>
            <div style={{paddingBottom:5}}>{"Last updated: " + formatDate((new Date(book.date_modified)).toString())}</div>
            <div style={{paddingBottom:5}}>{"Author: " + book.author}</div>
            <div style={{paddingBottom:5}}>{"Chapter: " + book.chapters.length}</div>
            <div style={{paddingBottom:5}}>{"Description: " + book.description}</div>
          </div>
        }
        leftAvatar={
          <img
            src={book.image}
            style={styles.bookCover}
          />
        }
        rightIconButton={
          <IconMenu
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem primaryText="View" onClick={()=>this.onViewBook(book)} />
            <MenuItem primaryText={book.is_share ? "Unshare" : "Share"} onClick={book.is_share ? ()=>this.onUnShareBook(book) : ()=>this.onShareBook(book)} />
            <MenuItem primaryText={book.is_allow_copy ? "Don't allow copy" : "Allow copy"} onClick={()=>this.onAllowCopy(book, !book.is_allow_copy)} />
            {
              book.is_share ?
              <MenuItem primaryText="Copy link" onClick={()=>this.onCopyLink(book)} />
              : null
            }
            <MenuItem primaryText="Edit info" onClick={()=>this.onEditInfoBook(book)} />
            <MenuItem primaryText="Delete" onClick={()=>this.onShowConfirmDialog(book)} />
          </IconMenu>
        }
        onClick={()=>this.onEditBook(book)}
      />
    );
  }

  render() {
    var is_desktop = this.state.deviceWidth >= 992;

    var styles={
      container: {
        backgroundColor: "#eee",
        padding: is_desktop ? "40px 190px" : 0,
      },
      card: {
        minHeight: is_desktop ? "calc(100vh - 144px)": "calc(100vh - 64px)",
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
      row: {
        marginLeft: 0,
        marginRight:0,
      },
      colLeft: {
        paddingLeft: 0,
        paddingRight: 0,
      },
      colRight: {
        paddingRight: 0,
        paddingLeft: 0,
      }
    };

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={()=>this.setState({openDialog: false})}
      />,
      <FlatButton
        label="OK"
        primary={true}
        onClick={this.onAddNewBook}
      />,
    ];

    var list_1 = [],
    list_2 = [];
    for (var i = 0; i < this.state.list_books.length; i++) {
      if(i<this.state.list_books.length/2){
        list_1.push(this.state.list_books[i]);
      } else {
        list_2.push(this.state.list_books[i]);
      }
    }

    return (
      <div style={styles.container}>
        <Card style={styles.card}>
          <div className="row" style={styles.row}>
            <div className="col-md-6" style={styles.colLeft}>
              <List>
                {
                  list_1.map(book=>(
                    this.renderBookItem(book)
                  ))
                }
              </List>
            </div>
            <div className="col-md-6" style={styles.colRight}>
              <List>
                {
                  list_2.map(book=>(
                    this.renderBookItem(book)
                  ))
                }
              </List>
            </div>
          </div>
        </Card>
        <FloatingActionButton
          style={styles.floatingActionButton}
          onClick={()=>this.setState({openDialog: true})}
        >
          <AddIcon/>
        </FloatingActionButton>

        <Dialog
          title="Add new book"
          actions={actions}
          modal={false}
          contentStyle={styles.dialogContentStyle}
          onRequestClose={()=>this.setState({openDialog: false})}
          autoScrollBodyContent={true}
          open={this.state.openDialog}
        >
          <TextField
            fullWidth
            autoFocus
            floatingLabelText="Book's name"
            value={this.state.newBookName}
            onChange={(e, newBookName)=>this.setState({newBookName})}
            onKeyPress={e=>{if(e.key === 'Enter'){this.onAddNewBook()}}}
          />
        </Dialog>

        <ConfirmBox ref={confirmBoxDelete=>this.confirmBoxDelete=confirmBoxDelete} onClickOk={this.onDeleteBook} />

        <LinkDialog ref={r=>this.LinkDialog = r}/>

        <BookDetailDialog
          ref={r=>this.bookDetailDialog=r}
          onClose={this.loadData}
        />

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

export default ListBookScreen;