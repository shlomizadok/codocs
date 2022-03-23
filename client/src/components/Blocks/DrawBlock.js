import React, { Component } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import Excalidraw, { exportToSvg } from "@excalidraw/excalidraw";
import { GET_DOC, SUBMIT_BLOCK } from '../../utils/gql';
import client from '../../utils/apollo';

class DrawBlock extends Component {

  constructor(props) {
    super(props)
    console.log("props I sent", props)
    this.state = {
      isOpen: true,
      input: {
        _id: props._id,
        content: props.content,
        drawElements: props.drawElements,
        doc_id: props.doc_id,
        order: props.order,
        contentType: props.contentType
      },
    }
    this.myRef = React.createRef();
    this.onClose = this.onClose.bind(this)
    this.updateDrawElements = this.updateDrawElements.bind(this)
  }

  onClose() {
    console.log("closing")
    this.setState({isOpen: !this.state.isOpen})
    this.updateDrawElements()
  }

  async updateDrawElements() {
    // const newInput = this.state.input;
    // newInput.drawElements = elements;
    if (this.myRef.current) console.log(":55:",this.myRef.current.getSceneElements())
    // this.setState({ input: newInput });
    
      const svg = await exportToSvg({
        elements: this.myRef.current.getSceneElements(),
        appState: {
          width: 300,
          height: 100
        },
        embedScene: true
      });
      console.log(svg.outerHTML);
      this.setState({
        input: {
          _id: this.state.input._id,
          content: svg.outerHTML,
          drawElements: this.myRef.current.getSceneElements(),
          doc_id: this.state.input.doc_id,
          order: this.state.input.order,
          contentType: this.state.input.contentType
        }
      })
      console.log(this.state)
  }

  render() {
    const { isOpen } = this.state;
    const { drawElements } = this.state.input;
    return (
      <Modal fullscreen='xl' size='xl' isOpen={isOpen} toggle={this.onClose}>
        <ModalHeader toggle={this.onClose}>
          Draw something neat
        </ModalHeader>
        <ModalBody>
          <div className='excalidraw-wrapper'>
            <Excalidraw
              ref={this.myRef}
              zenModeEnabled
              detectScroll
              width="600"
              height="400"
              initialData={[]}
              // onChange={(elements, state) =>
              //   console.log("Elements :", elements, "State : ", state, "React state", this.state)
              //   // this.updateDrawElements(elements)
              // }
              // onPointerUpdate={(payload) => console.log(payload)}
              theme="light"
              name="Custom name of drawing"
              UIOptions={{ canvasActions: { loadScene: false } }}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          Footer here
        </ModalFooter>
      </Modal>
    )
  }
}

export default DrawBlock;