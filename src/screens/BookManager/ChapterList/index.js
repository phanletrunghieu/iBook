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

import {addChapter, getBooksData, getBookByID} from "../../../api/BookAPI";
import {formatDate} from "../../../utils/helper"


class ChapterListScreen extends Component {

  chapter_state={
    openDialog: false,
    newChapterName: "",
    chapter_list: [],
  };

  constructor(props){
    super(props);

    this.onAddNewChapter = this.onAddNewChapter.bind(this);
    this.loadData = this.loadData.bind(this);
    //this.loadChapterList = this.loadChapterList.bind(this);
    this.onEditChapter = this.onEditChapter.bind(this);
  }

  loadData() {
    getBookByID(this.props.match.params.bookId)
    .then(book => {
      this.setState({book});
    });
  }

  componentDidMount() {
    this.loadData();
  }

  onAddNewChapter(){
    addChapter(this.state.newChapterName)
    .then(()=>{
      this.setState({
        openDialog: false,
        newChapterName: "",
      });

      this.loadData();
    });
  }

  onEditChapter(chapter){
    browserHistory.push('/app/book/chapter_list/'+chapter.id);
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
        paddingLeft: 50
      },
      leftAvatarOfListItem: {
        borderRadius: 0,
        height: 225,
        width: 150,
        marginRight: 300,
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
        onClick={this.onAddNewChapter}
      />,
    ];

    return (
      <div>
        this.state.book;
        <List>
          {
            this.state.book.map(book=>(
              <ListItem
                style={styles.listItem}
                key={book.id}
                primaryText={book.name}
                secondaryText={
                  ["Ngày tạo:" + "\u00A0\u00A0\u00A0" + formatDate((new Date(book.date_created)).toString()),
                  <br />,
                  "Ngày cập nhật cuối: " + formatDate((new Date(book.date_modified)).toString())]
                }
                secondaryTextLines={2}
                rightAvatar={
                  <Avatar
                    src="images/cover.jpg"
                    style={styles.leftAvatarOfListItem}
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
            onChange={(e, newChapterName)=>this.setState({newChapterName})}
            onKeyPress={e=>{if(e.key === 'Enter'){this.onAddNewChapter()}}}
          />
        </Dialog>
      </div>
    );
  }
}

export default ChapterListScreen;
