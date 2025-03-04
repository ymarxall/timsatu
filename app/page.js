'use client';

import { useState } from 'react';
import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import Link from 'next/link';

export default function SignIn() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.target);
    const nikadmin = formData.get('nikadmin');
    const pass = formData.get('pass');        

    const payload = { nikadmin, pass }; 
    console.log('Mengirim ke http://192.168.1.4:8080/api/user/login dengan data:', payload);

    try {
      const response = await fetch('http://localhost:8080/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('Status HTTP:', response.status);
      const text = await response.text();
      console.log('Respons mentah dari server:', text);

      let data;
      try {
        data = JSON.parse(text);
        console.log('Respons JSON:', data);
      } catch (parseErr) {
        throw new Error('Respons bukan JSON: ' + text);
      }

      if (response.ok && data.data) {
        console.log('Token ditemukan, menyimpan ke cookie:', data.data);
        document.cookie = `token=${data.data}; path=/; max-age=3600`; 
        console.log('Cookie setelah disimpan:', document.cookie); 
        console.log('Redirect ke dashboard');
        window.location.href = '/dashboard';
      } else {
        console.log('Tidak ada token di respons');
        setError(data.message || 'Login gagal');
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
            <div className="mb-4">
              <Link href="/">
                <Image
                  src="/images/brand/logo/logo.png"
                  className="mb-2"
                  style={{ width: '60px', height: 'auto', display: 'block', margin: '0 auto' }}
                  alt=""
                />
              </Link>
              <p className="mb-6">Masukkan informasi login Anda.</p>
            </div>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="nikadmin">
                <Form.Label>Nomor Induk Kependudukan</Form.Label>
                <Form.Control
                  type="text"
                  name="nikadmin" // Ubah ke nikadmin
                  placeholder="737############"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="pass">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="pass" // Ubah ke pass
                  placeholder="**************"
                  required
                />
              </Form.Group>
              {error && <p className="text-danger">{error}</p>}
              <div className="d-grid">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Memproses...' : 'Masuk'}
                </Button>
              </div>
              <div className="d-md-flex justify-content-between mt-4">
                <div>
                  <Link href="/authentication/forget-password" className="text-inherit fs-5">
                    Lupa password?
                  </Link>
                </div>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}