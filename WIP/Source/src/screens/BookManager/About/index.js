import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import Author from './Author';

class AboutScreen extends Component {

  render() {

    var styles={
      container: {
        margin: 0,
      },
      logoUit: {
        display: 'block',
        width: "50%",
        maxWidth: 150,
        margin: "auto",
      },
      author: {
        marginTop: 15,
      }
    }

    return (
      <div>
        <img style={styles.logoUit} alt="logo uit" src="/images/logo-uit.png" />
        <div className="row" style={styles.container}>
          <div className="col-md-6">
            <Author
              name="Phan Lê Trung Hiếu"
              avatar="/images/avatar-1.jpg"
              style={styles.author}
            />
            <Author
              name="Nguyễn Xuân Hảo"
              avatar="/images/avatar-3.jpg"
              style={styles.author}
            />
          </div>
          <div className="col-md-6">
            <Author
              name="Nguyễn Kim Hiếu"
              avatar="/images/avatar-2.jpg"
              style={styles.author}
            />
            <Author
              name="Trần Thiện Hòa"
              avatar="/images/avatar-4.jpg"
              style={styles.author}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default AboutScreen;

