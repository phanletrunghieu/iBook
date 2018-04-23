import React, { Component } from 'react';

import {getBookByID} from "../../../api/BookAPI";

class BookEditorScreen extends Component {

  state={
    book: {},
  };

  constructor(props){
    super(props);

    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData(){
    getBookByID(this.props.match.params.bookId)
    .then(book=>{
      this.setState({book});
    });
  }

  render() {
    var styles={
    };

    return (
      <div>
        <div>{this.props.match.params.bookId}</div>
      </div>
    );
  }
}

export default BookEditorScreen;
