import React, { useState, useEffect, useContext } from "react";
import Plot from "react-plotly.js";
import { AuthContext } from "../../Context/AuthContext";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import Spinner from "react-bootstrap/Spinner";

/** @author Tomi Lechpammer
 * This function will retrieve and display donation data for a requestor.
 */
function RequestorDashboard() {
  const [commitHistory, setCommitHistory] = useState([]);
  const { user } = useContext(AuthContext);

  /* Set spinner while data is still loading. */
  const [loading, stillLoading] = useState(true);

  /* Retrieve individual user's data. */
  useEffect(() => {
    fetch("/user/reqemail/" + user.username)
      .then((response) => response.json())
      .then((data) => {
        setCommitHistory(data);
        stillLoading(false);
      })
      .catch((error) => console.log(error));

    return function cleanup() {};
  }, [user.username]);

  /* Convert date strings to date objects. */
  commitHistory.forEach((element) => {
    element.date = new Date(element.date);
  });

  /* Collumns for active donations table. */
  const cols = [
    {
      dataField: "donorhistory",
      text: "Date Posted",
    },
    {
      dataField: "itemtype",
      text: "Type of PPE",
    },
    {
      dataField: "quantity",
      text: "Quantity",
    },
  ];

  /* Sort donations by date, add data to arrays for graphs and table. */
  commitHistory.sort((a, b) => a.date - b.date);
  const dates = [];
  const quantities = [];
  const ppe = [];
  const cumulativeQty = [];
  commitHistory.forEach((element, index) => {
    dates.push(element.date);
    quantities.push(element.quantity);
    ppe.push(element.itemtype);
    if (index === 0) cumulativeQty.push(element.quantity);
    else cumulativeQty.push(element.quantity + cumulativeQty[index - 1]);
  });

  /* Main rendering of dashboard content. */
  function renderDash() {
    return (
      <div className="container">
        {commitHistory.length > 0 ? (
          <div className="container">
            <h1 className="heading1">Donations Received</h1>
            <BootstrapTable
              keyField="_id"
              data={commitHistory}
              columns={cols}
              wrapperClasses="table-responsive"
              striped={true}
              pagination={paginationFactory()}
            />
          </div>
        ) : (
          <h1 style={{ textAlign: "center" }}>
            You have not yet received any donations
          </h1>
        )}

        <hr></hr>

        {commitHistory.length > 0 ? (
          <div className="container">
            <h1 className="heading1">Donations Overview</h1>
            <Plot
              data={[
                {
                  x: dates,
                  y: quantities,
                  type: "scatter",
                  name: "Individual Donations",
                  line: {
                    color: "rgb(55, 128, 191)",
                    width: 1,
                  },
                },
                {
                  x: dates,
                  y: cumulativeQty,
                  type: "scatter",
                  name: "Cumulative Donations",
                  line: {
                    color: "rgb(219, 64, 82)",
                    width: 3,
                  },
                },
              ]}
              useResizeHandler={true}
              style={{ width: "100%", height: "100%" }}
              layout={{ autosize: true, title: "Donations Over Time" }}
            />
            <Plot
              data={[
                {
                  values: quantities,
                  labels: ppe,
                  type: "pie",
                  textinfo: "label+percent",
                  textposition: "outside",
                  automargin: true,
                },
              ]}
              useResizeHandler={true}
              style={{ width: "100%", height: "100%" }}
              layout={{ autosize: true, title: "PPE Proportions" }}
            />
          </div>
        ) : (
          <hr></hr>
        )}
      </div>
    );
  }

  /* Check if content is still being retrieved first. */
  return (
    <div className="container">
      {loading ? (
        <div class="text-center m-5">
          <React.Fragment>
            <Spinner
              as="span"
              animation="border"
              size="large"
              role="status"
              aria-hidden="true"
            />
            &nbsp; Loading Dashboard...
          </React.Fragment>
        </div>
      ) : (
        renderDash()
      )}
    </div>
  );
}

export default RequestorDashboard;
