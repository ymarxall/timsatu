'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import Link from 'next/link';

export default function ResetPassword() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.target);
    // const token = formData.get('token');
    const password = formData.get('password');

    try {
      const response = await fetch('http://localhost:8080/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        alert('Password berhasil direset!');
        router.push('/authentication/sign-in');
      } else {
        setError(data.message || 'Gagal mereset password');
      }
    } catch (err) {
      setError('Terjadi kesalahan pada server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        <Card className="smooth-shadow-md">
          <Card.Body className="p-6">
            <div className="mb-4">
              <Link href="/">
                <Image src="/images/brand/logo/logo-primary.png" className="mb-2" style={{ width: '60px', height: 'auto', display: 'block', margin: '0 auto' }} alt="" />
              </Link>
              <p className="mb-6">Please enter your token and new password.</p>
            </div>
            <Form onSubmit={handleSubmit}>
              {/* <Form.Group className="mb-3" controlId="token">
                <Form.Label>Token</Form.Label>
                <Form.Control type="text" name="token" placeholder="Enter the token you received" required />
              </Form.Group> */}
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password" name="password" placeholder="**************" required />
              </Form.Group>
              {error && <p className="text-danger">{error}</p>}
              <div className="d-grid">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}