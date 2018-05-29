import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
import Card from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import Snackbar from 'material-ui/Snackbar';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import AddIcon from 'material-ui/svg-icons/content/add';

import config from '../../../config';
import AppBar from 'material-ui/AppBar';
import NavigationMenuIcon from 'material-ui/svg-icons/navigation/menu';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';

import ConfirmBox from "../../../components/ConfirmBox";

import browserHistory from "../../../utils/browserHistory";

import {getBookByID, addChapter, deleteChapter, editChapterName} from "../../../api/BookAPI";


class ChapterListScreen extends Component {
  state={
    book: {chapters: []},
    openDialogAddChapter: false,
    openDialogRenameChapter: false,

    newChapterName: "",
    renameChapterName: "",

    selectedChapter: null,

    snackbarMessage: "",

    title_app_bar: config.app_name,
  };

  constructor(props) {
    super(props);

    this.updateDimensions = this.updateDimensions.bind(this);
    this.loadData = this.loadData.bind(this);
    this.onAddNewChapter = this.onAddNewChapter.bind(this);
    this.onEditChapter = this.onEditChapter.bind(this);
    this.onDeleteChapter = this.onDeleteChapter.bind(this);
    this.onRenameChapter = this.onRenameChapter.bind(this);
  }

  componentDidMount() {
    this.loadData();

    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions();

  }

  loadData() {
    getBookByID(this.props.match.params.bookId)
    .then(book=> {
      this.setState({book});
    });
  }

  updateDimensions() {
    this.setState({deviceWidth: window.innerWidth});
  }

  onAddNewChapter(){
    addChapter(this.state.book.id, this.state.newChapterName)
    .then(()=>{
      this.setState({
        openDialogAddChapter: false,
        newChapterName: "",
      });

      this.loadData();
    });
  }

  onEditChapter(bookId, chapter){
    browserHistory.push('/app/book/' + bookId + '/' + chapter.id);
  }

  onShowConfirmDialog(chapter){
    this.confirmBoxDelete.setState({
      show: true,
      data: chapter,
      title: "Confirm",
      body: "Delete chapter \"" + chapter.name + "\"?",
    });
  }

  onDeleteChapter() {
    var chapter=this.confirmBoxDelete.state.data;
    deleteChapter(this.state.book.id, chapter.id)
    .then(() => {
      this.loadData();
      this.setState({snackbarMessage: "Delete successfully!"})
    });
  }

  onRenameChapter(){
    editChapterName(this.state.book.id, this.state.selectedChapter.id, this.state.renameChapterName)
    .then(() => {
      this.loadData();
      this.setState({
        openDialogRenameChapter: false,
        snackbarMessage: "Rename successfully!"
      })
    });
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
      },
      listChapter: {
        backgroundColor:"#eee",
        padding: is_desktop ? "40px 300px": "0",
        minHeight: "calc(100vh - 64px)",
      },
    };

    var pathname = this.props.location.pathname;
    //right trim
    if (pathname.substring(pathname.length-1)==="/") {
      pathname = pathname.substring(0, pathname.length);
    }
    var is_home = pathname==="/app";

    const actionsAddChapter = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={()=>this.setState({openDialogAddChapter: false})}
      />,
      <FlatButton
        label="OK"
        primary={true}
        onClick={this.onAddNewChapter}
      />,
    ];

    const actionsRenameChapter = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={()=>this.setState({openDialogRenameChapter: false})}
      />,
      <FlatButton
        label="OK"
        primary={true}
        onClick={this.onRenameChapter}
      />,
    ];

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
        <div style={styles.listChapter}>
          <Card>
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
                        <MenuItem primaryText="Rename" onClick={()=>this.setState({openDialogRenameChapter: true, renameChapterName: chapter.name, selectedChapter: chapter})} />
                        <MenuItem primaryText="Delete" onClick={()=>this.onShowConfirmDialog(chapter)} />
                      </IconMenu>
                    }
                    onClick={()=>this.onEditChapter(this.state.book.id, chapter)}
                  />
                ))
              }
            </List>
          </Card>
        </div>
        <FloatingActionButton
          style={styles.floatingActionButton}
          onClick={()=>this.setState({openDialogAddChapter: true})}
        >
          <AddIcon/>
        </FloatingActionButton>

        <Dialog
          title="Add new chapter"
          actions={actionsAddChapter}
          modal={false}
          contentStyle={styles.dialogContentStyle}
          onRequestClose={()=>this.setState({openDialogAddChapter: false})}
          autoScrollBodyContent={true}
          open={this.state.openDialogAddChapter}
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

        <Dialog
          title="Rename chapter"
          actions={actionsRenameChapter}
          modal={false}
          contentStyle={styles.dialogContentStyle}
          onRequestClose={()=>this.setState({openDialogRenameChapter: false})}
          autoScrollBodyContent={true}
          open={this.state.openDialogRenameChapter}
        >
          <TextField
            fullWidth
            autoFocus
            floatingLabelText="Chapter's name"
            value={this.state.renameChapterName}
            onChange={(e, renameChapterName)=>this.setState({renameChapterName})}
            onKeyPress={e=>{if(e.key === 'Enter'){this.onRenameChapter()}}}
          />
        </Dialog>

        <ConfirmBox ref={confirmBoxDelete=>this.confirmBoxDelete=confirmBoxDelete} onClickOk={this.onDeleteChapter} />

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

export default ChapterListScreen;
