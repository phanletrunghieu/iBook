import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
import Snackbar from 'material-ui/Snackbar';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import AddIcon from 'material-ui/svg-icons/content/add';

import browserHistory from "../../../utils/browserHistory";

import {addBook, getBooksData, deleteBook} from "../../../api/BookAPI";
import {formatDate} from "../../../utils/helper"

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
    this.onEditBook = this.onEditBook.bind(this);
    this.onViewBook = this.onViewBook.bind(this);
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

  onViewBook(book){
    browserHistory.push('/app/book/'+book.id+'/view');
  }

  onEditInfoBook(book){
    browserHistory.push('/app/book/'+book.id+'/detail');
  }

  onDeleteBook(book){
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
        height: 255,
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
          <div style={{height: 255, paddingLeft: 10, 'white-space': 'unset'}}>
            <div>{"Date created: " + formatDate((new Date(book.date_created)).toString())}</div>
            <div>{"Last updated: " + formatDate((new Date(book.date_modified)).toString())}</div>
            <div>{"Author: " + book.author}</div>
            <div>{"Description: " + book.description}</div>
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
            <MenuItem primaryText="Edit info" onClick={()=>this.onEditInfoBook(book)} />
            <MenuItem primaryText="Delete" onClick={()=>this.onDeleteBook(book)} />
          </IconMenu>
        }
        onClick={()=>this.onEditBook(book)}
      />
    );
  }

  render() {
    var is_desktop = this.state.deviceWidth >= 992;

    var styles={
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
      <div>
        <div className="row" style={styles.row}>
          <div className="col-md-4" style={styles.colLeft}>
            <List>
              {
                list_1.map(book=>(
                  this.renderBookItem(book)
                ))
              }
            </List>
          </div>
          <div className="col-md-4" style={styles.colRight}>
            <List>
              {
                list_2.map(book=>(
                  this.renderBookItem(book)
                ))
              }
            </List>
          </div>
        </div>
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
