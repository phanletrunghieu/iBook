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



import FlatButton from 'material-ui/FlatButton';


import config from '../../../config';



class BookDetailScreen extends Component {

  state={
  };

  constructor(props){
    super(props);

    this.onSelectImage = this.onSelectImage.bind(this);
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



    return (
      <div>
        <div style={{overflow:"hidden", padding: "0 50px", marginTop:150}}>
          <div style={{position: "relative", float:"left", width: 200}}>
            <img className="book-cover" src="https://gacsach.com/sites/gacsach.com/files/styles/book310/public/images/2728/2363e788c756aaa9ff820cc90a6a72c0_0.jpg?itok=O3YxDCgY" alt="Book cover" style={{width:200, height: 300}}  />
            <input style={styles.coverInput} type="file" accept="image/*" id="cover-image-upload" name="img" onChange={this.onSelectImage} />
            <label style={styles.coverLabel} htmlFor="cover-image-upload"></label>

          </div>

          <div>
            <div style={{float:"left", marginLeft:50, width: "calc(100% - 250px)"}}>
                <TextField

                inputStyle={{fontSize:40, }}
                hintText="Tên Sách"
                defaultValue="Bàn có 5 chỗ ngồi"
                fullWidth
                multiLine={true}
                underlineShow={false}
                />
            </div>



            </div>

            <div style={{float:"center", marginLeft:250, marginRight:150, marginTop:50}}>
              <TextField
                inputStyle={{fontSize:20}}
                hintText="Mô tả nội dung sách"
                underlineShow={false}
                fullWidth
                multiLine={true}
              />
          </div>

        </div>



      </div>
    );
  }
}

export default BookDetailScreen;
