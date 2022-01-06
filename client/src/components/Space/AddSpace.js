import React from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { Form as FinalForm, Field } from 'react-final-form';
import { GET_SPACES, SUBMIT_SPACE } from '../../utils/gql'
import client from '../../apollo';

const AddSpace = ({ post, onClose }) => (
  <FinalForm
    onSubmit={async ({ _id, name}) => {
      const input = { _id, name, public: true };

      await client.mutate({
        variables: { input },
        mutation: SUBMIT_SPACE,
        refetchQueries: () => [{ query: GET_SPACES }],
      });

      onClose();
    }}
    initialValues={post}
    render={({ handleSubmit, pristine, invalid }) => (
      <Modal isOpen toggle={onClose}>
        <Form onSubmit={handleSubmit}>
          <ModalHeader toggle={onClose}>
            {post._id ? 'Edit Post' : 'New Post'}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Name</Label>
              <Field
                required
                name="name"
                className="form-control"
                component="input"
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" disabled={pristine} color="primary">Save</Button>
            <Button color="secondary" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </Form>
      </Modal>
    )}
  />
);

export default AddSpace;