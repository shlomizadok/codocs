import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Col, Row, Input, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import SideMenu from '../menus/SideMenu';
import { useQuery } from 'react-apollo';
import client from '../../utils/apollo';
import { GET_SPACES, GET_DOC, SUBMIT_DOC } from '../../utils/gql';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function useDoc(props) {
  const urlParams = useParams();
  const { loading, error, data } = useQuery(GET_DOC, { variables: { id: urlParams.id } })
  if (!loading)
    return <Doc {...urlParams} {...data} />

  return <>~Error loading?</>
}

class Doc extends Component {

  constructor(props) {
    super(props)
    this.state = {
      doc: props.doc
    }
    this.changeDoc = this.changeDoc.bind(this)
    this.changeDocContent = this.changeDocContent.bind(this)
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

  changeDoc(event) {
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
      console.log("ressss", res);
    }, 2000)
  }

  changeDocContent(event) {
    return console.log("GGGGGG", event)
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
      console.log("ressss", res);
    }, 2000)
  }

  render() {
    const { doc } = this.state;
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
              onChange={this.changeDoc}
            />
            {doc.blocks.map((block) => {      
              // Handle different block types (if text... if image... if code, etc.)      
              return (
                <ReactQuill
                  key={block._id} 
                  value={block.content} 
                  onChange={this.changeDocContent} 
                />
              )
            })}
          </Col>
        </Row>
      </Container>
    );
  }

}

export default useDoc;