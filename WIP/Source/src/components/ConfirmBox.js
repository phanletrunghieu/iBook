import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class ConfirmBox extends Component {

  constructor(props){
    super(props);
    this.state={
      show: false,
      data: {},
    };
  }

  onClickOk(e){
    this.setState({show: false});
    this.props.onClickOk();
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={()=>this.setState({show: false})}
      />,
      <FlatButton
        label="OK"
        primary={true}
        onClick={this.onClickOk.bind(this)}
        keyboardFocused={true}
      />,
    ];

    return(
      <Dialog
        actions={actions}
        modal={false}
        open={this.state.show}
        onRequestClose={()=>this.setState({show: false})}>
        {this.state.body}
      </Dialog>
    );
  }
}

export default ConfirmBox;
