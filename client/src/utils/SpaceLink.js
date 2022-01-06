import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { NavLink } from 'reactstrap';
import { GoPlus } from 'react-icons/go';
import client from '../apollo';
import { SUBMIT_DOC } from './gql';

const createDoc = async (space) => {
  const input = { title: "Untitled", space_id: space._id }
  const res = await client.mutate({
    variables: { input },
    mutation: SUBMIT_DOC
  });
  if (res) {
    window.location = `/docs/${res.data.submitDoc._id}`
  } else {
    // @todo: Implement error handler
    console.log("error, no res", res)
  }
}

const SpaceLink = (props) => {
  const { space } = props;
  const params = useParams();
  const [isShown, setIsShown] = useState(false);
  return (
    <NavLink
      href={`/spaces/${space._id}`}
      key={space._id}
      active={space._id === params.id}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      {space.name} 
      {isShown && (
        <GoPlus 
          className="mr-12"
          onClick={(e) => {e.preventDefault(); createDoc(space)}}
        />
      )}
    </NavLink>
  )
}

export default SpaceLink;