import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import browserHistory from "../../utils/browserHistory";

import './Home.css';

class HomeScreen extends Component {

  constructor(props){
    super(props);

    this.goApp = this.goApp.bind(this);
  }

  goApp(){
    browserHistory.push('/app');
  }

  render() {
    return (
      <div className="container home-page">
        <div className="full-screen home-background"></div>
        <header>
          <div className="logo">
            <img src="images/logo.png" alt="iBook – Ứng dụng viết sách" title="iBook – Ứng dụng viết sách" width="40"/>
            <span>ibook</span>
          </div>
        </header>
        <div className="auth">
          <div className="row">
            <div className="col-sm-8 offset-sm-2">
              <div className="title">
                Sách là người bạn lớn của con người<br/>
                hãy để <span className="hightlight">iBook</span> là tri kỷ trong trái tim bạn
              </div>
              <h1 className="sub-title">
                Ứng dụng đọc sách miễn phí Ebooks văn học, ngoại ngữ, kinh tế, ngôn tình...
              </h1>
              <RaisedButton primary label="Get Started" onClick={this.goApp} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomeScreen;
