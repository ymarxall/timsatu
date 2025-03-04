'use client'
// import node module libraries
import { Col, Row, Container } from 'react-bootstrap';

// import widget as custom components
import { PageHeading } from 'widgets'
const Profile = () => {
  return (
    <Container fluid className="p-6">
      {/* Page Heading */}
      <PageHeading heading="Overview"/>

      {/* content */}
      <div className="py-6">
        <Row>
        
          <Col xl={6} lg={12} md={12} xs={12} className="mb-6">

          

          </Col>
        </Row>
      </div>

    </Container>
  )
}

export default Profile