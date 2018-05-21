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
    	<div>
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
	      	<div className="container">
            <div className="row introduce">
	      			<div className="col-md-7 col-xs-12 section1_img">
	      				<img src="/images/devices.png" alt="devices"/> 
	      			</div>
	          	<div className="col-md-5 col-xs-12 section1_title">
	          		<h3>Đọc từ bất cứ nơi nào trên điện thoại của bạn</h3>
	          		<p>Ibooks có tất cả những câu chuyện mà bạn cần, 
                  và chúng tôi làm cho nó dễ dàng để đọc — ngay trên điện thoại của bạn. 
                  Cho dù bạn online hay offline, bạn có thể đọc liên tục mà không cần lo lắng 
                  về việc tải xuống tập tin PDF.
                </p>
	          	</div>
	      		</div> 

            <div className="row introduce">
              <div className="col-md-5 col-xs-12 section2_title">
                <h3>Trở thành một phần của trải nghiệm</h3>
                <p>Hãy xem người khác phản ứng thế nào với những twist 
                gây bất ngờ điên rồ đó. Bình luận trong dòng của Wattpad 
                cho phép bạn chia sẻ suy nghĩ và tương tác với câu chuyện trong khi đọc.
                </p>
              </div>
              <div className="col-md-7 col-xs-12 section2_img">
                <img src="/images/comments2.png" alt="devices"/>
              </div>
            </div>  
	      	</div> 
          <div className=" footer">
            <div className="footer-content">
              <h2>Mang theo ibook với bạn</h2>
              <p>“Sách là nơi lưu giữ nền văn minh.<br/>
                  Không có sách, lịch sử trầm lặng, văn chương buồn chán”
              </p>
            </div>
            <div className="auth-footer">
              <div className="row">
                  <div className="col-sm-3 col-xs-12 text-left">
                    <span className="title-footer">ibook</span>
                  </div>
                  <div className="col-sm-2"></div>
                  <div className="col-sm-7 col-xs-12 text-right">
                    <p>Ibook - Ứng dụng đọc sách miễn phí</p>
                  </div>
              </div>
            </div>
          </div>
      </div>
    );
  }
}

export default HomeScreen;
