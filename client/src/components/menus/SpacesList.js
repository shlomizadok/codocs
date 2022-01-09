import React from 'react';
import { Query } from 'react-apollo';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { GET_SPACES } from '../../utils/gql';
import SpaceLink from './SpaceLink';
import { useParams }  from 'react-router-dom';

const SpacesList = (props) => {
  const params = useParams();
  return (
    <Query query={GET_SPACES}>
      {({ loading, data }) => !loading && (
        <>
          {data.spaces.map(space => (
            <NavItem
              key={space._id}
              tag="div"
            >
              <SpaceLink space={space} />
              <Nav 
                vertical 
                className="child"
                tag="nav"
              >
                {space.docs.map(doc => (
                  <NavItem key={doc._id} tag="div">
                    <NavLink
                      href={`/docs/${doc._id}`}
                      key={doc._id}
                      active={params.id === doc._id}
                    >
                      -  {doc.title}
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
            </NavItem>
          ))}
        </>
      )}
    </Query>
  )
}

export default SpacesList;