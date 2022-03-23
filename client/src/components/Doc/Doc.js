import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Col, Row, Input, Breadcrumb, BreadcrumbItem, Button } from 'reactstrap';
import SideMenu from '../menus/SideMenu';
import { useQuery } from 'react-apollo';
import client from '../../utils/apollo';
import { GET_SPACES, GET_DOC, SUBMIT_DOC } from '../../utils/gql';
import TextBlock from '../Blocks/TextBlock';
import DrawBlock from '../Blocks/DrawBlock';

function useDoc(props) {
  const urlParams = useParams();
  const { loading, error, data } = useQuery(GET_DOC, 
    { 
      variables: { id: urlParams.id },
      pollInterval: 5000,
    },
  )
  if (!loading)
    return <Doc {...urlParams} {...data} />

  if (error) return <>~Error</>
  return <>loading?</>
}

class Doc extends Component {

  constructor(props) {
    super(props)
    this.state = {
      doc: props.doc,
      addNewTextBlock: false,
      addNewDrawBlock: false,
    }
    this.changeDocTitle = this.changeDocTitle.bind(this);
    this.resetNewTextBlock = this.resetNewTextBlock.bind(this);
  }

  prepDocForSaving() {
    const { doc } = this.state;
    const input = {
      title: doc.title,
      content: doc.content,
      _id: doc._id
    }
    return input
  }

  changeDocTitle(event) {
    const { doc } = this.state;
    doc.title = event.target.value;
    this.setState({ doc });
    const input = this.prepDocForSaving()
    // Need to think of ways to delay here, so won't be sending a lot for traffic on each key stroke.
    setTimeout(async () => {
      const res = await client.mutate({
        variables: { input },
        mutation: SUBMIT_DOC,
        refetchQueries: () => [
          { query: GET_DOC, variables: { id: doc._id } },
          { query: GET_SPACES }
        ],
      });
    }, 2000)
  }

  resetNewTextBlock(newBlock) {
    console.log("I've been summoned", newBlock)
    const {doc} = this.state
    if (!doc.blocks.includes(newBlock)) doc.blocks.push(newBlock)
    this.setState({ addNewTextBlock: false })
  }

  render() {
    const { doc, addNewTextBlock, addNewDrawBlock } = this.state;
    const emptyBlock = {
      content: "",
      contentType: "text",
      doc_id: doc._id,
      order: doc.blocks.length,
      _id: null
    }

    const emptyDrawBlock = {
      content: null,
      contentType: "draw",
      drawElements: [],
      doc_id: doc._id,
      order: doc.blocks.length,
      _id: null
    }

    return (
      <Container fluid>
        <Row>
          <SideMenu />
          <Col md={9}>
            <Breadcrumb>
              <BreadcrumbItem>{doc.space.name}</BreadcrumbItem>
              <BreadcrumbItem>{doc.title}</BreadcrumbItem>
            </Breadcrumb>
            <Input
              value={doc.title}
              onChange={this.changeDocTitle}
            />
            {doc.blocks.map((block) => {
              // Handle different block types (if text... if image... if code, etc.)
              if (block.contentType === "text") {
                return (
                  <TextBlock {...block} key={block._id} />
                )
              }
            })}
            {(doc.blocks.length === 0) && (
              <TextBlock {...emptyBlock} />
            )}
            {(addNewTextBlock) && (
              <TextBlock {...emptyBlock} reset={this.resetNewTextBlock}/>
            )}
            {(addNewDrawBlock) && (
              <DrawBlock
                {...emptyDrawBlock}
              />
            )}
            <p>
              <Button
                onClick={() => (this.setState({addNewTextBlock: true}))}
                color='secondary'
              >
                Add text
              </Button>  
              <Button
                onClick={() => (this.setState({addNewDrawBlock: !this.state.addNewDrawBlock}))}
                color='secondary'
              >
                Add draw
              </Button>  
            </p>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default useDoc;