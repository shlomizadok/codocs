import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Col, Row, Breadcrumb, BreadcrumbItem, Input } from 'reactstrap';
import SideMenu from '../menus/SideMenu';
import { useQuery } from 'react-apollo';
import { GET_SPACE, SUBMIT_SPACE, GET_SPACES } from '../../utils/gql';
import client from '../../utils/apollo';

function useSpace(props) {
  const urlParams = useParams();
  const { loading, error, data } = useQuery(GET_SPACE, { variables: { id: urlParams.id } })
  if (!loading)
    return <Space {...data} {...urlParams} />

  return <>Error</>
}

class Space extends Component {
  constructor(props) {
    super(props)
    this.state = {
      space: props.space,
      editing: false
    }
    this.updateSpace = this.updateSpace.bind(this)
  }

  prepareSpaceForSaving() {
    const { space } = this.state;
    return { name: space.name, public: true, _id: space._id }
  }

  async updateSpace(event) {
    const { space } = this.state;
    space.name = event.target.value;
    this.setState({ space })
    const input = this.prepareSpaceForSaving()
    await client.mutate({
      variables: { input },
      mutation: SUBMIT_SPACE,
        refetchQueries: () => [
          { query: GET_SPACE, variables: { id: space._id } },
          { query: GET_SPACES }
        ],
    })
  }

  render() {
    const { space } = this.state;
    return (
      <Container fluid>
        <Row>
          <SideMenu />
          <Col md={9}>
            <Breadcrumb>
              <BreadcrumbItem>{space.name}</BreadcrumbItem>
            </Breadcrumb>
            <Input
              value={space.name}
              onChange={this.updateSpace}
            />
            <h6>docs:</h6>
            {space.docs.map((doc) => (
              <p key={doc._id}>{doc.title}</p>
            ))}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default useSpace;