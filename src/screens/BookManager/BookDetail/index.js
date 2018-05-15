import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import SvgIconFace from 'material-ui/svg-icons/action/face';
import {blue300, indigo900} from 'material-ui/styles/colors';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';

import SaveIcon from 'material-ui/svg-icons/content/save';

import {getBookByID,editBookName,editBookCover} from "../../../api/BookAPI";



import FlatButton from 'material-ui/FlatButton';


import config from '../../../config';



class BookDetailScreen extends Component {

  state={
    BookData: {},
  };

  constructor(props){
    super(props);

    this.onSelectImage = this.onSelectImage.bind(this);
    this.loadData=this.loadData.bind(this);
    this.onChangeName=this.onChangeName.bind(this);
    this.onChangeImage=this.onChangeImage.bind(this);
    this.onChangeAuthor=this.onChangeAuthor.bind(this);
    this.save=this.save.bind(this);
  }

  componentDidMount(){
    this.loadData();
  }

  onSelectImage(e){
    console.log(e.target.files);
    if(e.target.files.length>0){
      var file=e.target.files[0];
      var reader = new FileReader();

      reader.onloadend = function () {
        document.querySelector('.book-cover').src = reader.result;
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
    //chưa có Author trong BookAPI.
  }

  loadData()
  {
    var BookId=this.props.match.params.bookId;
    getBookByID(BookId)
    .then(BookData=>
      {
        this.setState({BookData})
      }
    )
  }

  save()
  {

  }

  render() {
    var styles={
      coverInput: {
        display: 'none'
      },
      coverLabel: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: "100%",
        height: "100%"
      }
    }

    var btSave={
      floatingActionButton: {
        position: 'fixed',
        bottom: 15,
        right: 15,
      },
    };


    return (
      <div>
        <div style={{overflow:"hidden", padding: "0 50px", marginTop:150}}>
          <div style={{position: "relative", float:"left", width: 200}}>
            <img className="book-cover" src={this.state.BookData.image} alt="Book cover" style={{width:200, height: 300}}  />
            <input style={styles.coverInput} type="file" accept="image/*" id="cover-image-upload" name="img" onChange={this.onSelectImage} />
            <label style={styles.coverLabel} htmlFor="cover-image-upload"></label>

          </div>

          <div style={{float:"left", marginLeft:50, width: "calc(100% - 250px)"}}>
            <TextField
              inputStyle={{fontSize:40, }}
              hintText="Tên Sách"
              value={this.state.BookData.name}
              fullWidth
              underlineShow={false}
              onChange={(e,newName)=>this.onChangeName(newName)}
            />

            <TextField
              inputStyle={{fontSize:20}}
              floatingLabelFixed={true}
              floatingLabelText="Tác gỉả"
            />


          </div>

            <div style={{float:"center", marginLeft:250, marginRight:150, marginTop:50}}>
              <TextField
                inputStyle={{fontSize:20}}
                floatingLabelFixed={true}
                floatingLabelText="Mô tả nội dung "
                multiLine={true}
                fullWidth
              />
          </div>

        </div>

        <div style={{float:"right"}}>
          {
            this.state.deviceWidth >= 992 ?
            <RaisedButton
            label="Save"
            primary={true}
            icon={<SaveIcon />}
            btSave={styles.floatingActionButton}
            onClick={this.save}
            />
            :
            <FloatingActionButton
              btSave={styles.floatingActionButton}
              onClick={this.save}
              >
              <SaveIcon/>
              </FloatingActionButton>
            }
        </div>

      </div>
    );
  }
}

export default BookDetailScreen;
