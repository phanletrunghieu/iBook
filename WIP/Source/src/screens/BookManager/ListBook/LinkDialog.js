import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

class LinkDialog extends Component {

  state={
    open: false,
    link: "",
  };

  constructor(props){
    super(props);

    this.show=this.show.bind(this);
    this.hide=this.hide.bind(this);
  }

  show(link){
    this.setState({
      link: link,
      open: true
    });
  }

  hide(){
    this.setState({
      link: "",
      open: false
    });
  }

  render() {
    var styles={
      dialogContentStyle: {
        width: 350,
        maxWidth: 'none',
      },
    };

    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.hide}
      />,
    ];

    return (
      <Dialog
        title="Share"
        actions={actions}
        modal={false}
        contentStyle={styles.dialogContentStyle}
        onRequestClose={this.hide}
        autoScrollBodyContent={true}
        open={this.state.open}
      >
        <TextField
          fullWidth
          autoFocus
          floatingLabelText="Book's link"
          value={this.state.link}
          onChange={(e, newValue)=>{}}
        />
      </Dialog>
    );
  }
}

export default LinkDialog;