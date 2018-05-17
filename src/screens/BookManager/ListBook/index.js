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

    this.onAddNewBook = this.onAddNewBook.bind(this);
    this.loadData = this.loadData.bind(this);
    this.onEditBook = this.onEditBook.bind(this);
    this.onEditInfoBook = this.onEditInfoBook.bind(this);
    this.onDeleteBook = this.onDeleteBook.bind(this);
  }

  componentDidMount() {
    this.loadData();

    var that=this;
    setInterval(function () {
      that.loadData();
    }, 30*1000);
  }

  loadData(){
    console.log("loadData");
    getBooksData()
    .then(list_books=>{
      this.setState({list_books});
    });
  }

  onAddNewBook(){
    addBook(this.state.newBookName)
    .then(()=>{
      this.setState({
        openDialog: false,
        newBookName: "",
        snackbarMessage: "Thêm thành công sách \"" + this.state.newBookName + "\"",
      });

      this.loadData();
    })
    .catch(err=>{
      console.log("Lỗi thêm sách", err);
      this.setState({snackbarMessage: "Thêm thất bại"});
    });
  }

  onEditBook(book){
    browserHistory.push('/app/book/'+book.id);
  }

  onEditInfoBook(book){
    browserHistory.push('/app/book/'+book.id+'/detail');
  }

  onDeleteBook(book){
    deleteBook(book.id)
    .then(()=>{
      this.setState({snackbarMessage: "Đã xoá \"" + book.name + "\""});

      this.loadData();
    })
    .catch(err=>{
      console.log("Lỗi xoá sách", err);
      this.setState({snackbarMessage: "Xoá thất bại"});
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
        fontWeight: 700,
        fontSize: "larger",
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
          <div style={{height: 100}}>
            <div>{"Ngày tạo:\u00A0\u00A0\u00A0" + formatDate((new Date(book.date_created)).toString())}</div>
            <div>{"Ngày cập nhật gần nhất: " + formatDate((new Date(book.date_modified)).toString())}</div>
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
            <MenuItem primaryText="Edit info" onClick={()=>this.onEditInfoBook(book)} />
            <MenuItem primaryText="Delete" onClick={()=>this.onDeleteBook(book)} />
          </IconMenu>
        }
        onClick={()=>this.onEditBook(book)}
      />
    );
  }

  render() {
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
        marginRight: 0,
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
