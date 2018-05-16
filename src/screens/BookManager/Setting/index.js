import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

import browserHistory from "../../../utils/browserHistory";

import {getTimeAutoSave, setTimeAutoSave, getTimeAutoSync, setTimeAutoSync} from "../../../api/SettingAPI";

class SettingScreen extends Component {

  state={
    deviceWidth: 0,
    time_auto_save: parseInt(getTimeAutoSave(), 10),
    time_auto_sync: parseInt(getTimeAutoSync(), 10),
    snackbarMessage: "",
  }

  constructor(props){
    super(props);

    this.updateDimensions = this.updateDimensions.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  componentWillMount() {
    this.updateDimensions();
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }
  updateDimensions() {
    this.setState({deviceWidth: window.innerWidth});
  }

  onSave(){
    setTimeAutoSave(this.state.time_auto_save);
    setTimeAutoSync(this.state.time_auto_sync);
    this.setState({snackbarMessage: "Lưu thành công"});
  }

  render() {

    var is_desktop = this.state.deviceWidth >= 992;

    var styles = {
      container: {
        margin: "auto",
        width: is_desktop ? 400 : "calc(100% - 20px)",
        paddingTop: is_desktop ? 100 : 0,
      }
    }

    return (
      <div style={styles.container}>
        <TextField
          type="number"
          floatingLabelText="Time auto save (minute)"
          fullWidth
          value={this.state.time_auto_save.toString()}
          onChange={(e, newValue)=>this.setState({time_auto_save: parseInt(newValue, 10)})}
        />
        <TextField
          type="number"
          floatingLabelText="Time sync (minute)"
          fullWidth
          value={this.state.time_auto_sync.toString()}
          onChange={(e, newValue)=>this.setState({time_auto_sync: parseInt(newValue, 10)})}
        />
        <div style={{textAlign: "center"}}>
          <RaisedButton
            primary
            label="Lưu"
            labelStyle={{textTransform: "none"}}
            onClick={this.onSave}
          />
        </div>

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

export default SettingScreen;
