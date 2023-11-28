import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Container, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "../../App.css"


const CreatedEvents = ({loggedInUser}) => {
    const [venuesData, setVenuesData] = useState(null);
    const [filteredVenues, setFilteredVenues] = useState([]);
    const [activeFilter, setActiveFilter] = useState('myCreatedEvents'); // Default to My Created Events
  
    const apiCalled = useRef(false);
    useEffect(() => {
      if (!apiCalled.current) {
        async function fetchData() {
            fetch('http://localhost:3500/home/myHostedEvents', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({"user":loggedInUser}),
              })
                .then((response) => response.json())
                .then((data) => {
                  setVenuesData(data);
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
          apiCalled.current = true;
        }
        fetchData();
      }
    }, []);
  
    const [sportTypeFilter, setSportTypeFilter] = useState('');
    const [poolSizeFilter, setPoolSizeFilter] = useState('');
  
    useEffect(() => {
      setFilteredVenues(venuesData);
    }, [venuesData]);
  
    const applyFilters = () => {
      const filteredResults = venuesData.filter((venue) => {
        const passSportTypeFilter = !sportTypeFilter || venue.sportType === sportTypeFilter;
        const passPoolSizeFilter =
          !poolSizeFilter || venue.current_pool_size.toString() >= poolSizeFilter;
        return passSportTypeFilter && passPoolSizeFilter;
      });
      setFilteredVenues(filteredResults);
    };
  
    const navigate = useNavigate();
  
    const handleCardClick = (venueId) => {
      // Redirect to the detailed view of the clicked event
      navigate(`../myHostedEvent/${venueId}`);
    };
  
    const VenueCard = ({ venue }) => (
      <Col md={12} className="mb-4">
        <Card onClick={() => handleCardClick(venue.id)}>
          <Card.Body className="d-flex align-items-center" style={{ padding: '0px !important' }}>
            <div className="mr-3">
              <Card.Img
                variant="left"
                src={venue.photoUrl[0]}
                style={{ width: '150px', height: '150px' }}
                alt={`Venue ${venue.event_name}`}
              />
            </div>
            <div id="card-body-details">
              <Card.Title>{venue.event_name}</Card.Title>
              <Card.Text>
                Sport Type: {venue.sportType}
                <br />
                Pool Size: {venue.current_pool_size} players out of {venue.pool_size}
                <br />
                Venue: {venue.name}
              </Card.Text>
            </div>
          </Card.Body>
        </Card>
      </Col>
    );
  
    const VenueList = ({ venues }) => (
      <Row>
        {venues && venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </Row>
    );
  
    return (
      <Container fluid className="mt-4">
        <div className="headingnButton">
          <div className='ButtonLeftMargin'>
            <Button
              variant={activeFilter === 'liveEvents' ? 'primary' : 'secondary'}
              onClick={() => {
                setActiveFilter('liveEvents');
                // Navigate to the root path ('/') when "Live Events" is clicked
                navigate('/playerHome');
              }}
            >
              Live Events
            </Button>
            <Button
              variant={activeFilter === 'myEvents' ? 'primary' : 'secondary'}
              onClick={() => {
                setActiveFilter('myEvents');
                // Add logic to fetch and display user's events
                navigate('../myEvents'); // Navigate to MyEvents path
              }}
            >
              My Events
            </Button>
            <Button
              variant={activeFilter === 'myCreatedEvents' ? 'primary' : 'secondary'}
              onClick={() => {
                setActiveFilter('myCreatedEvents');
                // Add logic to fetch and display user's created events
              }}
            >
              Hosted Events
            </Button>
          </div>
          <div>
            <Button className="btn btn-success" onClick={() => navigate('../host-event')}>
              Host an event
            </Button>
          </div>
        </div>
  
        <Row>
          <Col md={3}>
            <Form className="sticky-top bg-light p-3">
              <h5>Event Filters</h5>
              <Form.Group controlId="sportTypeFilter">
                <Form.Label>Sport Type</Form.Label>
                <Form.Control as="select" onChange={(e) => setSportTypeFilter(e.target.value)}>
                  <option value="">All</option>
                  <option value="Football">Football</option>
                  <option value="Badminton">Badminton</option>
                  {/* Add more sport types as needed */}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="poolSizeFilter">
                <Form.Label>Pool Size</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter number of players"
                  onChange={(e) => setPoolSizeFilter(e.target.value)}
                />
              </Form.Group>
              <Button className="d-flex" variant="primary" onClick={applyFilters} id="FilterSubmit">
                Apply filters
              </Button>
            </Form>
          </Col>
          <Col md={9}>
            <VenueList venues={filteredVenues} />
          </Col>
        </Row>
      </Container>
    );
  };
  
  export default CreatedEvents;
  