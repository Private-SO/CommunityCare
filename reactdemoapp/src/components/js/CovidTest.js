/**
 * Author : Ram prasath Meganathan (B00851418) - This COVID Screening page is used to check if the user is a valid
 *  COVID candidate and show them the hosiptal to go to in maps
 * Allowed Roles: All unregistered users, Registered roles: donor, requestor
 */

/*global google*/
import React, { Component } from "react";
import { Form, Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import "../css/CovidTest.css";

class Maps extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedfeverstate: "",
      selectedheadachestate: "",
      selectedbreathestate: "",
      selectedcoughstate: "",
      selectedachestate: "",
      submitdisabled: "",
      checkForCovid: "",
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      email: "",
      showComponent: false,
      currentLatitude: 0,
      currentLongitude: 0

    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this);
  };


  componentDidMount() {
    window.scrollTo(0, 0);
    this.state.checkForCovid = '';
  }

  //HandleChange will update the state values when a user is typed in the form.
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });

  };

  // submitValidation will check whether the given phone number is valid or not.
  submitValidation() {
    let disabled = this.state.selectedfeverstate && this.state.selectedheadachestate && this.state.selectedbreathestate
      && this.state.selectedcoughstate && this.state.selectedachestate
    this.state.submitdisabled = disabled
    return this.state.submitdisabled

  }

  //handleSubmit is triggered when the donor clicks on the submit button.
  handleSubmit(event) {
    event.preventDefault();
    let covidStatus = this.state.selectedachestate === 'yes' && this.state.selectedbreathestate === 'yes'
      && this.state.selectedcoughstate === 'yes' && this.state.selectedheadachestate === 'yes'
      && this.state.selectedfeverstate === 'yes'
    this.state.checkForCovid = covidStatus
    this.setState({ showComponent: true })
   if(this.state.checkForCovid)
   {
    setTimeout(() => { initialize() }, 100);
   }
    axios.post('/user/covidscreen', {
      email: this.state.email,
      covidpositive: this.state.checkForCovid
    }).then(res => {
      console.log(res)
      return res.data
    }).catch(err => {
      console.log(err)
    })
  }
  render() {
    return (
      <section>
        <React.Fragment>
          <article className="heading">
            <h1>Are you having COVID-19 symptoms?</h1>
            <li>All fields are required unless marked as optional.</li>
            <li>Please answer the questions for initial screening</li>
          </article>
          <article className="container">
            <article
              style={{ padding: "50px" }}
              className="col-12 col-md-9 offset-md-3 form"
            >
              <Form onSubmit={this.handleSubmit}>
                <Form.Group as={Row} controlId="email">
                  <Form.Label column md={4}>
                    Email
                    </Form.Label>
                  <Col md={4}>
                    <Form.Control
                      type="email"
                      placeholder="email"
                      autoFocus
                      size="sm"
                      required
                      name="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                    />
                  </Col>
                </Form.Group>
                <fieldset>
                  <Form.Group as={Row}>
                    <Form.Label as="legend" column md={4}>
                      Are you having consistent fever?
                     </Form.Label>
                    <Col md={4}>
                      <Form.Control
                        as="select"
                        onChange={this.handleChange}
                        name="selectedfeverstate"
                        value={this.state.selectedfeverstate}
                        required
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Form.Control>
                    </Col>
                  </Form.Group>
                </fieldset>
                <fieldset>
                  <Form.Group as={Row}>
                    <Form.Label as="legend" column md={4}>
                      Are you having persistent cough?
                    </Form.Label>
                    <Col md={4}>
                      <Form.Control
                        as="select"
                        onChange={this.handleChange}
                        name="selectedcoughstate"
                        value={this.state.selectedcoughstate}
                        required
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Form.Control>
                    </Col>
                  </Form.Group>
                </fieldset>
                <fieldset>
                  <Form.Group as={Row}>
                    <Form.Label as="legend" column md={4}>
                      Do you have muscle or body ache?
                     </Form.Label>
                    <Col md={4}>
                      <Form.Control
                        as="select"
                        onChange={this.handleChange}
                        name="selectedachestate"
                        value={this.state.selectedachestate}
                        required
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Form.Control>
                    </Col>
                  </Form.Group>
                </fieldset>
                <fieldset>
                  <Form.Group as={Row}>
                    <Form.Label as="legend" column md={4}>
                      Do you have a congestion or a runny rose?
                 </Form.Label>
                    <Col md={4}>
                      <Form.Control
                        as="select"
                        onChange={this.handleChange}
                        name="selectedheadachestate"
                        value={this.state.selectedheadachestate}
                        required
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Form.Control>
                    </Col>
                  </Form.Group>
                </fieldset>
                <fieldset>
                  <Form.Group as={Row}>
                    <Form.Label as="legend" column md={4}>
                      Do you have shortness of breath?
                   </Form.Label>
                    <Col md={4}>
                      <Form.Control
                        as="select"
                        onChange={this.handleChange}
                        name="selectedbreathestate"
                        value={this.state.selectedbreathestate}
                        required
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </Form.Control>
                    </Col>
                  </Form.Group>
                </fieldset>
                <Form.Group as={Row}>
                  <Col xs={4} md={{ span: 4, offset: 2 }}>
                    <a href="/">
                      <Button variant="secondary">Not now</Button>
                    </a>
                  </Col>
                  <Col xs={4} md={{ span: 3 }}>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!this.submitValidation()}
                    >
                      Submit
                      </Button>
                  </Col>
                </Form.Group>

              </Form>
              {this.state.showComponent ?
                this.state.checkForCovid == true ?
                  [
                    <React.Fragment>
                      <article style={{ position: "relative", width: "100%", height: "500px" }}>
                        <Form.Label className="covid19positive">You are a potential COVID-19 candidate, Please check the map for the hospitals near your location</Form.Label>
                        <article id="map" style={{ height: "45vh" }}>
                        </article>
                      </article>
                    </React.Fragment>
                  ]

                  :
                  <Form.Label className="covid19negative">You may not be a potential COVID-19 candidate</Form.Label>
                : null

              }
            </article>
          </article>
        </React.Fragment>

      </section>
    );
  }
}


export default Maps


const initialize = function () {
  let location = new Object();
  navigator.geolocation.getCurrentPosition((position) => {
    location.latitude = position.coords.latitude
    location.longitude = position.coords.longitude

    var center = new google.maps.LatLng(location.latitude, location.longitude);
    var map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: location.latitude, lng: location.longitude },
      zoom: 13
    });
    var request = {
      location: center,
      radius: '5000',
      type: ['hospital']
    };

    const callback = function (results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i])

        }
      }
    }

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

    const createMarker = function (place) {
      let content =  `<h5>${place.name}</h5><h6>${place.vicinity}</h6>`
      console.log(place)
      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name
      })
      var infowindow = new google.maps.InfoWindow({
        content: content
      })
      bindInfoWindowToMap(marker, map, infowindow, content);
      marker.setMap(map)
    }

    function bindInfoWindowToMap(marker, map, infowindow, content) {
      marker.addListener('click', function () {
        infowindow.setContent(content)
        infowindow.open(map, this)
      })
    }
  })
}



