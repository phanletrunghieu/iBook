import React, { Component } from 'react';
import {Card} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

class Author extends Component {

  render() {

    var styles = {
      avatar: {
        display: 'inline-block',
        width: 100,
        height: 100,
        borderRadius: "50%",
        margin: 10,
      },
      name: {
        display: 'inline-block',
      }
    }

    return (
      <Card style={this.props.style}>
        <img
          alt="author avatar"
          src={this.props.avatar}
          style={styles.avatar}
        />
        <div style={styles.name}>{this.props.name}</div>
      </Card>
    );
  }
}

export default Author;
