import React, { Component } from 'react';
import {HotKeys} from 'react-hotkeys';
import {Link} from 'react-router-dom';
import {List, ListItem} from 'material-ui/List';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';

import SortIcon from 'material-ui/svg-icons/content/sort';

import {cloneBook, getChapterByID, getBookByID} from "../../api/BookAPI";
import {isSignIn} from "../../api/UserAPI";
import GoogleDriveAPI from '../../api/GoogleDriveAPI';

import browserHistory from "../../utils/browserHistory";

import './UserBookViewer.css';

class UserBookViewerScreen extends Component {

  state={
    book: {
      chapters: [],
    },
    currentChapterIndex: -1,
    is_cloned: false,
    deviceWidth: 0,
    snackbarMessage: "",
    backgroundColor: "#F4F4F4",
    fontFamily: "'Palatino Linotype', serif",
    fontSize: 24,
    lineHeight: 1.6,
  };

  constructor(props){
    super(props);

    this.updateDimensions = this.updateDimensions.bind(this);
    this.loadData = this.loadData.bind(this);
    this.onChangeChapter = this.onChangeChapter.bind(this);
    this.nextChapter = this.nextChapter.bind(this);
    this.prevChapter = this.prevChapter.bind(this);
  }

  componentWillMount() {
    this.updateDimensions();
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    this.loadData();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
    setInterval(this.intervalAutoSave);
  }
  updateDimensions() {
    this.setState({deviceWidth: window.innerWidth});
  }

  loadData() {
    var drive_id = this.props.match.params.bookDriveId;
    GoogleDriveAPI.getFileContent(drive_id)
    .then(book=>{
      if(!book){
        return Promise.reject("Book was not found");
      }

      book = JSON.parse(book);

      this.setState({book});

      if(book.chapters.length > 0)
        this.setState({currentChapterIndex: 0});

      return getBookByID(book.id);//check exist in viewer's account
    })
    .then(book=>{
      this.setState({is_cloned: !!book});
    })
    .catch(err=>this.setState({snackbarMessage: err.message || err}));
  }

  onChangeChapter(chapterId){
    var book = this.state.book;
    var index = book.chapters.findIndex(chapter=>chapter.id===chapterId);
    if (index===-1)
      return;
    this.setState({currentChapterIndex: index});
  }

  nextChapter(){
    var index = this.state.currentChapterIndex;
    if(index >= this.state.book.chapters.length - 1)
      return;

    this.onChangeChapter(this.state.book.chapters[index+1].id);
  }

  prevChapter(){
    var index = this.state.currentChapterIndex;
    if(index <= 0)
      return;

    this.onChangeChapter(this.state.book.chapters[index-1].id);
  }

  render() {
    const keyMap = {
        'previousChapter': 'ctrl+left',
        'nextChapter': 'ctrl+right'
        };
    const handlers = {
          'previousChapter': this.prevChapter,
          'nextChapter': this.nextChapter,
        };

    var is_desktop = this.state.deviceWidth >= 992;

    var buttonNext = is_desktop ? "Chương sau" : "Sau";
    var buttonPrev = is_desktop ? "Chương trước" : "Trước";

    var chapter = this.state.currentChapterIndex!==-1 ? this.state.book.chapters[this.state.currentChapterIndex] : null;
    console.log(this.state.currentChapterIndex);

    var styles={
      container: {
        backgroundColor: this.state.backgroundColor,
      },
      ckContent: {
        fontFamily: this.state.fontFamily,
        fontSize: this.state.fontSize,
        lineHeight: this.state.lineHeight,
        paddingTop: 50,
        paddingBottom: 50,
      },
      prevButton: {
        backgroundColor: this.state.currentChapterIndex === 0 ? "#d0d0d0" : "#5cb85c",
      },
      nextButton: {
        backgroundColor: this.state.currentChapterIndex === this.state.book.chapters.length-1 ? "#d0d0d0" : "#5cb85c",
      },
    }

    return (
      <HotKeys keyMap={keyMap} handlers={handlers}>
      <div className="book-viewer-screen" style={styles.container}>
        <header>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/"><img src="/images/logo.png"/>iBook</Link>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i className="fas fa-cog"></i>
                  Tùy chỉnh
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <form className="form-group">
                    <div className="option row">
                      <div className="col-md-5 col-xs-5" htmlFor="truyen-background">Màu nền</div>
                      <div className="col-md-7 col-xs-7">
                        <select className="form-control" id="truyen-background" value={this.state.backgroundColor} onChange={e=>this.setState({backgroundColor: e.target.value})}>
                          <option value="#F4F4F4">Xám nhạt</option>
                          <option value="#E9EBEE">Xanh nhạt</option>
                          <option value="#F4F4E4">Vàng nhạt</option>
                          <option value="#EAE4D3">Màu sepia</option>
                          <option value="#D5D8DC">Xanh đậm</option>
                          <option value="#FAFAC8">Vàng đậm</option>
                          <option value="#EFEFAB">Vàng ố</option>
                          <option value="#FFF">Màu trắng</option>
                          <option value="hatsan">Hạt sạn</option>
                          <option value="#232323">Màu tối</option>
                        </select>
                      </div>
                    </div>
                    <br/>
                    <div className="option row">
                      <div className="col-md-5" htmlFor="truyen-background">Font chữ</div>
                      <div className="col-md-7">
                        <select className="form-control" id="font-chu" value={this.state.fontFamily} onChange={e=>this.setState({fontFamily: e.target.value})}>
                          <option value="'Palatino Linotype', serif">Palatino Linotype</option>
                          <option value="Bookerly, serif">Bookerly</option>
                          <option value="Minion, serif">Minion</option>
                          <option value="'Segoe UI', sans-serif">Segoe UI</option>
                          <option value="Roboto, sans-serif">Roboto</option>
                          <option value="'Roboto Condensed', sans-serif">Roboto Condensed</option>
                          <option value="'Patrick Hand', sans-serif">Patrick Hand</option>
                          <option value="'Noticia Text', sans-serif">Noticia Text</option>
                          <option value="'Times New Roman', serif">Times New Roman</option>
                          <option value="Verdana, sans-serif">Verdana</option>
                          <option value="Tahoma, sans-serif">Tahoma</option>
                          <option value="Arial, sans-serif">Arial</option>
                        </select>
                      </div>
                    </div>
                    <br/>
                    <div className="option row">
                      <div className="col-md-5" htmlFor="truyen-background">Size chữ</div>
                      <div className="col-md-7">
                        <select className="form-control" id="size-chu" value={this.state.fontSize} onChange={e=>this.setState({fontSize: e.target.value})}>
                          <option value="16px">16</option>
                          <option value="18px">18</option>
                          <option value="20px">20</option>
                          <option value="22px">22</option>
                          <option value="24px">24</option>
                          <option value="26px">26</option>
                          <option value="28px">28</option>
                          <option value="30px">30</option>
                          <option value="32px">32</option>
                          <option value="34px">34</option>
                          <option value="36px">36</option>
                          <option value="38px">38</option>
                          <option value="40px">40</option>
                        </select>
                      </div>
                    </div>
                    <br/>
                    <div className="option row">
                      <div className="col-md-5" htmlFor="truyen-background">Chiều cao dòng</div>
                      <div className="col-md-7">
                        <select className="form-control" id="truyen-background" value={this.state.lineHeight} onChange={e=>this.setState({lineHeight: e.target.value})}>
                          <option value="1">100%</option>
                          <option value="1.2">120%</option>
                          <option value="1.4">140%</option>
                          <option value="1.6">160%</option>
                        </select>
                      </div>
                    </div>
                    <br/>
                  </form>
                </div>
              </li>
            </ul>

            <div className="form-inline my-2 my-lg-0">
              {
                isSignIn() && this.state.book.is_allow_copy && !this.state.is_cloned ?
                <button
                  className="btn btn-outline-success my-2 my-sm-0"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Add to my account"
                  onClick={()=>cloneBook(this.state.book)}
                >
                  <i className="fas fa-plus"></i>
                </button>
                : null
              }
            </div>
          </div>
        </nav>
        </header>
        <content style={{minHeight: "calc(100vh - 58px)", display: 'block'}}>
          {
            chapter ?
            <div className="container">
              <div className="title">
                <div className="book-name">
                  <center>{this.state.book.name}</center>
                </div>
                <div className="book-chapter">
                  <center>{chapter.name}</center>
                </div>
              </div>
              <center>
                <div className="btn-group btn-nav">
                  <a onClick={this.prevChapter} style={styles.prevButton}>
                    <i className="fas fa-angle-left"></i>
                    <span className="next">{buttonPrev}</span>
                  </a>
                  <select className="form-control select-chapter" value={chapter.id} onChange={e=>this.onChangeChapter(e.target.value)}>
                    {
                      this.state.book.chapters.map((chapter, index)=>(
                        <option key={index} value={chapter.id}>Chương {index+1}</option>
                      ))
                    }
                  </select>
                  <a onClick={this.nextChapter} style={styles.nextButton}>
                    <span className="next">{buttonNext}</span>
                    <i className="fas fa-angle-right"></i>
                  </a>
                </div>
              </center>
              <div className="ck-content" style={styles.ckContent} dangerouslySetInnerHTML={{__html: chapter.content}}/>
              <center style={{paddingBottom: 50}}>
                <div className="btn-group btn-nav">
                  <a onClick={this.prevChapter} style={styles.prevButton}>
                    <i className="fas fa-angle-left"></i>
                    <span className="next">{buttonPrev}</span>
                  </a>
                  <select className="form-control select-chapter" value={chapter.id} onChange={e=>this.onChangeChapter(e.target.value)}>
                    {
                      this.state.book.chapters.map((chapter, index)=>(
                        <option key={index} value={chapter.id}>Chương {index+1}</option>
                      ))
                    }
                  </select>
                  <a onClick={this.nextChapter} style={styles.nextButton}>
                    <span className="next">{buttonNext}</span>
                    <i className="fas fa-angle-right"></i>
                  </a>
                </div>
              </center>
            </div>
            :
            <div className="text-center" style={{fontSize: 30, paddingTop: 50}}>This content is not available.</div>
          }
        </content>

        <Snackbar
          open={this.state.snackbarMessage !== ""}
          message={this.state.snackbarMessage}
          autoHideDuration={4000}
          onRequestClose={()=>this.setState({snackbarMessage: ""})}
          bodyStyle={{textAlign: "center"}}
        />
      </div>
      </HotKeys>
    );
  }
}

export default UserBookViewerScreen;