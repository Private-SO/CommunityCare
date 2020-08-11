import React from "react";
import Modal from "react-bootstrap/Modal";
import SendNotification from "./Notification";
import {
  FormGroup,
  FormControl,
  FormLabel,
  Button,
  Form,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";

/** @author Tomi Lechpammer
 * Modal allows donors to close posts and notify requestors.
 */
function ClosePost(props) {
  /* Submit requestor's email credentials */
  const history = useHistory();

  const onConfirm = (e) => {
    fetch("/userrequest/complete", {
      method: "PUT",
      body: JSON.stringify({
        id: props._id,
        reqemail: e.target.email.value,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        console.log(data.reqemail);
        if (data.reqemail !== "") {
          SendNotification(data);
          history.push("/dashboard");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Close Post?
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={onConfirm}>
        <Modal.Body>
          <h4>
            {props.item} (x{props.qty}) - {props.date}
          </h4>
          <p>
            If you donated the {props.item}, please enter the requestor's email
            below:
          </p>
          <FormGroup controlId="email">
            <FormLabel>Requestor Email:</FormLabel>
            <FormControl autoFocus type="email" name="reqemail" />
            <Form.Text className="text-muted">Optional Field</Form.Text>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <p>
            <strong>Please note:</strong> closing a post is irreversible. You
            will need to create a new post if you wish to offer the item again.
          </p>
          <Button onClick={props.onHide}>Back</Button>
          <Button variant="danger" type="submit">
            Confirm
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default ClosePost;
