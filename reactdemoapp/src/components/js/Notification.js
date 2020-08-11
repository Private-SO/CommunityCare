function Notification(props) {
console.log("proprs"+JSON.stringify(props))
    fetch("/user/notifyRequestor", {
        method: "PUT",
        body: JSON.stringify({
          id: props._id,
          donorEmail: props.email,
          reqEmail: props.reqemail,
          item: props.itemtype,
          qty: props.quantity
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
    }) 
    .catch((error) => console.log(error));
  }

  export default Notification;