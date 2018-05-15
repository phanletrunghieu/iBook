import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import AddIcon from 'material-ui/svg-icons/content/add';

import browserHistory from "../../../utils/browserHistory";

import {getBookByID, addChapter, deleteChapter} from "../../../api/BookAPI";


class ChapterListScreen extends Component {
  state={
    book: {chapters: []},
    openDialog: false,
    newChapterName: "",
  };

  constructor(props) {
    super(props);

    this.loadData = this.loadData.bind(this);
    this.onAddNewChapter = this.onAddNewChapter.bind(this);
    this.onEditChapter = this.onEditChapter.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    getBookByID(this.props.match.params.bookId)
    .then(book=> {
      this.setState({book});
    });
  }

  onAddNewChapter(){
    addChapter(this.state.book.id, this.state.newChapterName)
    .then(()=>{
      this.setState({
        openDialog: false,
        newChapterName: "",
      });

      this.loadData();
    });
  }

  onEditChapter(bookId, chapter){
    browserHistory.push('/app/book/' + bookId + '/' + chapter.id);
  }

  onDeleteChapter(chapter_id) {
    deleteChapter(this.state.book.id, chapter_id)
    .then(() => {
      this.loadData();
      console.log("Xóa thành công");
    });
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
        paddingLeft: 10
      },
      leftAvatarOfListItem: {
        borderRadius: 0,
        height: 225,
        width: 150,
        marginRight: 300,
      },
      subheader: {
        paddingTop: 15,
        paddingLeft: 20,
        fontSize: 30
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
        <List>
          <Subheader style={styles.subheader}>{this.state.book.name}</Subheader>
          {
            this.state.book.chapters.map(chapter=>(
              <ListItem
                style={styles.listItem}
                key={chapter.id}
                primaryText={chapter.name}
                rightIconButton={
                  <IconMenu
                    iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                  >
                    <MenuItem primaryText="Delete" onClick={()=>this.onDeleteChapter(chapter.id)} />
                  </IconMenu>
                }
                onClick={()=>this.onEditChapter(this.state.book.id, chapter)}
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
          title="Add new chapter"
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
            floatingLabelText="Chapter's name"
            value={this.state.newChapterName}
            onChange={(e, newChapterName)=>this.setState({newChapterName})}
            onKeyPress={e=>{if(e.key === 'Enter'){this.onAddNewChapter()}}}
          />
        </Dialog>
      </div>
    );
  }
}

export default ChapterListScreen;
