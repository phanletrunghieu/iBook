import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import SvgIconFace from 'material-ui/svg-icons/action/face';
import {blue300, indigo900} from 'material-ui/styles/colors';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';

import SaveIcon from 'material-ui/svg-icons/content/save';

import Snackbar from 'material-ui/Snackbar';

import {getBookByID,updateBook} from "../../../api/BookAPI";



import FlatButton from 'material-ui/FlatButton';


import config from '../../../config';



class BookDetailDialog extends Component {

  state={
    BookData: {},
    SnackbarMessage:"",
    deviceWidth: 0,
    openDialog: false,
  };

  constructor(props){
    super(props);

    this.updateDimensions = this.updateDimensions.bind(this);
    this.onSelectImage = this.onSelectImage.bind(this);
    this.onChangeName=this.onChangeName.bind(this);
    this.onChangeImage=this.onChangeImage.bind(this);
    this.onChangeAuthor=this.onChangeAuthor.bind(this);
    this.onChangeDescription=this.onChangeDescription.bind(this);
    this.save=this.save.bind(this);

    this.show=this.show.bind(this);
    this.hide=this.hide.bind(this);
  }

  componentDidMount(){
    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }
  updateDimensions() {
    this.setState({deviceWidth: window.innerWidth});
  }

  onSelectImage(e){
    console.log("selected file", e.target.files);
    var that = this;
    if(e.target.files.length>0){
      var file=e.target.files[0];
      if(file.size>2097152)
      {
        this.setState({
          SnackbarMessage:"Image upload is limited to 2MB."
        })

        return;
      }
      var reader = new FileReader();

      reader.onloadend = function () {
        document.querySelector('.book-cover').src = reader.result;

        //lưu hình
        var BookData=that.state.BookData;
        BookData.image=reader.result;
        that.setState({BookData});
      }

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }

  onChangeImage(newImg)
  {
    var BookData=this.state.BookData;
    BookData.image=newImg;
    this.setState({BookData});
  }

  onChangeName(newName)
  {
    var BookData=this.state.BookData;
    BookData.name=newName;
    this.setState({BookData});
  }

  onChangeAuthor(newAuthor)
  {
    var BookData=this.state.BookData;
    BookData.author=newAuthor;
    this.setState({BookData});
  }

  onChangeDescription(newDescription)
  {
    var BookData=this.state.BookData;
    BookData.description=newDescription;
    this.setState({BookData});
  }

  save()
  {
    var new_data=this.state.BookData;
    var BookID=new_data.id;
    updateBook(BookID,new_data)
    .then(()=>{
      if(this.props.onClose)
        this.props.onClose();
      this.hide();
    })

  }

  show(book){
    this.setState({
      openDialog: true,
      BookData: book
    });
  }

  hide(){
    this.setState({openDialog: false});
  }

  render() {
    var is_desktop = this.state.deviceWidth >= 992;

    var styles={
      container: {
        overflow:"hidden",
        padding: is_desktop ? "10px 50px 0" : "0",
      },
      coverContainer: {
        position: "relative",
        float: is_desktop ? "left" : "none",
        margin: "0 auto 10px",
        width: 200
      },
      detailContainer: {
        float: is_desktop ? "left" : "none",
        marginLeft: is_desktop ? 50 : 0,
        width: is_desktop ? "calc(100% - 250px)" : "100%"
      },
      coverInput: {
        display: 'none'
      },
      coverLabel: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: "100%",
        height: "100%"
      },
      floatingActionButton: {
        position: 'fixed',
        bottom: 15,
        right: 15,
      },
    }

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.hide}
      />,
      <FlatButton
        label="OK"
        primary={true}
        onClick={this.save}
      />,
    ];

    return (
      <Dialog
        title="Edit"
        actions={actions}
        modal={false}
        contentStyle={styles.dialogContentStyle}
        onRequestClose={()=>this.setState({openDialog: false})}
        autoScrollBodyContent={true}
        open={this.state.openDialog}
      >
        <div style={styles.container}>
          <div style={styles.coverContainer}>
            <img className="book-cover" src={this.state.BookData.image} alt="Book cover" style={{width:200, height: 300}}  />
            <input style={styles.coverInput} type="file" accept="image/*" id="cover-image-upload" name="img" onChange={this.onSelectImage} />
            <label style={styles.coverLabel} htmlFor="cover-image-upload"></label>

          </div>

          <div style={styles.detailContainer}>
            <TextField
              inputStyle={{fontSize:40, }}
              hintText="Book's name"
              fullWidth
              underlineShow={false}
              value={this.state.BookData.name}
              onChange={(e,newName)=>this.onChangeName(newName)}
            />

            <TextField
              inputStyle={{fontSize:20}}
              floatingLabelFixed={true}
              floatingLabelText="Author"
              value={this.state.BookData.author}
              onChange={(e,newAuthor)=>this.onChangeAuthor(newAuthor)}
            />

            <TextField
              inputStyle={{fontSize:20}}
              floatingLabelFixed={true}
              floatingLabelText="Description"
              multiLine={true}
              fullWidth
              value={this.state.BookData.description}
              onChange={(e,newDescription)=>this.onChangeDescription(newDescription)}
            />
          </div>
        </div>

        <Snackbar
          bodyStyle={{textAlign:"center"}}
          open={this.state.SnackbarMessage!==""}
          message={this.state.SnackbarMessage}
          autoHideDuration={4000}
          onRequestClose={()=>this.setState({SnackbarMessage:""})}
        />

      </Dialog>
    );
  }
}

export default BookDetailDialog;
