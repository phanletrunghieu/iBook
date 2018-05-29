import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

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
    DecoupledEditor.create(
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
    // ckfinder: {
    //   uploadUrl: '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json'
    // },
    cloudServices: {
      tokenUrl:"https://33333.cke-cs.com/token/dev/ijrDsqFix838Gh3wGO3F77FSW94BwcLXprJ4APSp3XQ26xsUHTi0jcb1hoBt",
      uploadUrl:"https://33333.cke-cs.com/easyimage/upload/"
    }
  },
  isScriptLoaded: false,
  scriptUrl: "https://cdn.ckeditor.com/ckeditor5/10.0.1/decoupled-document/ckeditor.js",
  activeClass: "ckeditor",
  onChange: (data)=>{}
};

CKEditor.propTypes = {
  content: PropTypes.any,
  config: PropTypes.object,
  isScriptLoaded: PropTypes.bool,
  scriptUrl: PropTypes.string,
  activeClass: PropTypes.string,
  onChange: PropTypes.func
};

export default CKEditor;
