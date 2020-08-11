/**
 * @author Ryan Fernandes
 */

import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import "../css/DonorApprovalTable.css";

export default class DonorApprovalTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
  }

  approve = (_id) => {
    if (window.confirm("Are you sure?")) {
      fetch("/userrequest/Approve", {
        method: "PUT",
        body: JSON.stringify({
          id: _id,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((json) => {
          alert("Request is approved");
          this.getDataForTable();
        });
    }
  };

  reject = (_id) => {
    if (window.confirm("Are you sure?")) {
      fetch("/userrequest/Reject", {
        method: "PUT",
        body: JSON.stringify({
          id: _id,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((json) => {
          alert("Request is rejected");
          this.getDataForTable();
        });
    }
  };

  getDataForTable() {
    fetch("/userrequest/")
      .then((res) => res.json())
      .then((user) => {
        // let data =
        this.setState({ users: [...user] });
      });
  }

  componentDidMount() {
    this.getDataForTable();
  }

  renderTableData() {
    return this.state.users.map((user, index) => {
      const {
        _id,
        firstname,
        lastname,
        email,
        zip,
        phone,
        quantity,
        itemtype,
        date,
      } = user;
      return (
        <tr key={index + 1}>
          <td>{index + 1}</td>
          <td>{firstname}</td>
          <td>{lastname}</td>
          <td>{email}</td>
          <td>{zip}</td>
          <td>{phone}</td>
          <td>{quantity}</td>
          <td>{itemtype}</td>
          <td>
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            }).format(new Date(Date.parse(date)))}
          </td>
          <td>
            <div className="displaybutton">
              <Button variant="success" onClick={this.approve.bind(this, _id)}>
                Approve
              </Button>{" "}
              <Button variant="danger" onClick={this.reject.bind(this, _id)}>
                Reject
              </Button>
            </div>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div>
        <div className="heading1">
          <h1>Donor Approval Table</h1>
        </div>
        <div className="tablebody">
          {" "}
          <br />
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Id</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>ZIP</th>
                <th>Phone</th>
                <th>Quantity</th>
                <th>ItemType</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>{this.renderTableData()}</tbody>
          </Table>
        </div>
      </div>
    );
  }
}
