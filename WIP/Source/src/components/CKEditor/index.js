import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import './CKEditor.css';

class CKEditor extends React.Component {

  is_receive_content = false;

  constructor(props) {
    super(props);

    //Bindings
    this.onLoad = this.onLoad.bind(this);
  }

  componentDidMount() {
    this.onLoad();
  }

  componentWillReceiveProps(newProps){
    if(!this.is_receive_content && this.editor && newProps.content){
      this.is_receive_content = true;
			this.editor.setData(newProps.content);
		}
  }

  onLoad() {
    window.DecoupledEditor.create(
      document.querySelector( '.document-editor__editable' ),
      this.props.config
    )
    .then(editor => {
      this.editor = editor;

      const toolbarContainer = document.querySelector( '.document-editor__toolbar' );
      toolbarContainer.appendChild( editor.ui.view.toolbar.element );

      this.editor.setData(this.props.content);
      this.editor.model.document.on( 'change', () => this.props.onChange(editor.getData()));
    })
    .catch(error=>{
      console.error(error);
    });
  }

  render() {
    return (
      <div className="document-editor">
        <div className="document-editor__toolbar"></div>
        <div className="document-editor__editable-container">
          <div className="document-editor__editable"/>
        </div>
      </div>
    );
  }
}

CKEditor.defaultProps = {
  content: "",
  config: {

  },
  isScriptLoaded: false,
  activeClass: "ckeditor",
  onChange: (data)=>{}
};

CKEditor.propTypes = {
  content: PropTypes.any,
  config: PropTypes.object,
  isScriptLoaded: PropTypes.bool,
  activeClass: PropTypes.string,
  onChange: PropTypes.func
};

export default CKEditor;
