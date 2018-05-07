import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
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

import {addBook, getBooksData} from "../../../api/BookAPI";
import {formatDate} from "../../../utils/helper"

class ListBookScreen extends Component {

  state={
    openDialog: false,
    newBookName: "",
    list_books: [],
  };

  constructor(props){
    super(props);

    this.onAddNewBook = this.onAddNewBook.bind(this);
    this.loadData = this.loadData.bind(this);
    this.onEditBook = this.onEditBook.bind(this);
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
      });

      this.loadData();
    });
  }

  onEditBook(book){
    browserHistory.push('/app/book/edit/'+book.id);
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

    return (
      <div>
        <List>
          {
            this.state.list_books.map(book=>(
              <ListItem
                style={styles.listItem}
                innerDivStyle={styles.listItemContainer}
                key={book.id}
                primaryText={<span style={styles.bookTitle}>{book.name}</span>}
                secondaryText={ formatDate((new Date(book.id)).toString())}
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
                    <MenuItem primaryText="Delete" />
                  </IconMenu>
                }
                onClick={()=>this.onEditBook(book)}
              />
            ))
          }
        </List>
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
      </div>
    );
  }
}

export default ListBookScreen;
