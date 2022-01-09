import React, { Component } from 'react';
import { GET_DOC, SUBMIT_BLOCK } from '../../utils/gql';

import client from '../../utils/apollo';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const SavingState = Object.freeze({
  NOT_SAVED: 0,
  SAVING: 1,
  SAVED: 2
});

class TextBlock extends Component {

  constructor(props) {
    super(props);
    this.changeBlockContent = this.changeBlockContent.bind(this);
    this.state = {
      input: {
        _id: props._id,
        content: props.content,
        doc_id: props.doc_id,
        order: props.order,
        contentType: props.contentType
      },
      saving: SavingState.NOT_SAVED
    }
  }

  componentDidMount() {
    this.timer = null; // Need for autosaving
  }

  changeBlockContent(newContent) {
    clearTimeout(this.timer);
    const newInput = this.state.input;
    newInput.content = newContent;
    this.setState({ saving: SavingState.NOT_SAVED, input: newInput })
    this.timer = setTimeout(async() => { // Autosaving
      this.setState({ saving: SavingState.SAVING })
      await client.mutate({
        variables: { input: this.state.input },
        mutation: SUBMIT_BLOCK,
        refetchQueries: () => [
          { query: GET_DOC, variables: { id: this.state.input.doc_id } }
        ],
      }).then((res) => {
        this.setState({ saving: SavingState.SAVED }); 
        if (res) {
          delete res.data.submitBlock.__typename;
          this.setState({ input: res.data.submitBlock });
        }  
      });
    }, 2000);
  }

  render() {
    const { content, _id } = this.state.input;
    return (
      <>
        <ReactQuill
          key={_id}
          value={content}
          onChange={this.changeBlockContent}
        />
        {/* <AutoSaveDisplay saving={this.state.saving} /> */}
      </>
    )
  }
}

const AutoSaveDisplay = ({ saving }) => {
  let display;
  switch (saving) {
    case SavingState.SAVING:
      display = <em>saving...</em>;
      break;
    case SavingState.SAVED:
      display = (
        <>
          <em>saved!</em>
        </>
      );
      break;
    default:
      display = <br />;
  }
  return <div className="auto-save-display">{display}</div>;
};

// AutoSaveDisplay.propTypes = {
//   saving: PropTypes.oneOf(Object.values(SavingState))
// };

export default TextBlock;