'use client';

import { useState } from 'react';
import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import Link from 'next/link';

export default function ForgetPassword() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.target);
    const email = formData.get('email');

    try {
      const response = await fetch('http://localhost:8080/api/user/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      console.log('Status HTTP:', response.status); // Debug
      const text = await response.text();
      console.log('Respons mentah:', text);

      let data;
      try {
        data = JSON.parse(text);
        console.log('Respons JSON:', data);
      } catch (parseErr) {
        throw new Error('Respons bukan JSON: ' + text);
      }

      if (response.ok && data.code === 200) {
        alert('Link reset telah dikirim ke email Anda! Silakan cek email untuk melanjutkan.');
        window.location.href = '/'; // Kembali ke halaman login
      } else {
        setError(data.message || 'Gagal mengirim permintaan reset');
      }
    } catch (err) {
      console.error('Error:', err.message);
      setError('Gagal terhubung ke server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        <Card className="smooth-shadow-md">
          <Card.Body className="p-6">
            <div className="mb-4 text-center">
              <Link href="/">
                <Image
                  src="/images/brand/logo/logo-primary.png"
                  className="mb-2"
                  style={{ width: '60px', height: 'auto' }}
                  alt=""
                />
              </Link>
              <h4 className="mb-1">Lupa Password</h4>
              <p className="mb-6">Masukkan email untuk reset password Anda.</p>
            </div>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="nama@contoh.com"
                  required
                />
              </Form.Group>
              {error && <p className="text-danger text-center">{error}</p>}
              <div className="d-grid">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Mengirim...' : 'Reset Password'}
                </Button>
              </div>
              <div className="text-center mt-4">
                <Link href="/" className="text-primary">
                  Kembali ke Login
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}