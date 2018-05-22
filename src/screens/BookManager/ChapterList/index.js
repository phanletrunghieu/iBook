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

import config from '../../../config';
import AppBar from 'material-ui/AppBar';
import NavigationMenuIcon from 'material-ui/svg-icons/navigation/menu';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';

import AddIcon from 'material-ui/svg-icons/content/add';

import browserHistory from "../../../utils/browserHistory";

import {getBookByID, addChapter, deleteChapter} from "../../../api/BookAPI";


class ChapterListScreen extends Component {
  state={
    book: {chapters: []},
    openDialog: false,
    newChapterName: "",
    title_app_bar: config.app_name,
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
        fontFamily: 'Roboto',
        fontWeight: 700,
        fontSize: "larger",
        color: "black",
        'display': 'block',
        paddingTop: 15,
        paddingLeft: 20,
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

    var pathname = this.props.location.pathname;
    //right trim
    if (pathname.substring(pathname.length-1)==="/") {
      pathname = pathname.substring(0, pathname.length);
    }
    var is_home = pathname==="/app";

    return (
      <div>
        <AppBar
          title={this.state.title_app_bar}
          //onTitleClick={handleClick}
          style={{position: 'fixed', top: 0}}
          iconElementLeft={
            <IconButton
              onClick={is_home ? this.toggleDrawer : ()=>browserHistory.goBack()}
            >
              {
                is_home ? <NavigationMenuIcon/> : <ArrowBackIcon />
              }
            </IconButton>
          }
          iconElementRight={
            <IconMenu
              iconButtonElement={
                <IconButton><MoreVertIcon /></IconButton>
              }
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            >
              <MenuItem primaryText="Refresh" onClick={() => window.location.reload()} />
              <MenuItem primaryText="Detail" onClick={() => browserHistory.push('/app/book/' + this.state.book.id + '/detail')} />
              <MenuItem primaryText="View" onClick={() => browserHistory.push('/app/book/' + this.state.book.id + '/view')} />
              <MenuItem primaryText="Help" />
            </IconMenu>
          }
        />
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
