'use client';

import { useState } from 'react';
import { createElement } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import Link from 'next/link';

const { Row, Col, Card, Form, Button } = ReactBootstrap;

export default function SignUp() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.target);
    const email = formData.get('email');
    const nikadmin = formData.get('nikadmin');
    const pass = formData.get('pass');

    // Validasi NIK sebelum mengirim
    if (!/^\d{16}$/.test(nikadmin)) {
      setError('NIK harus terdiri dari 16 angka');
      setLoading(false);
      return;
    }

    const signupPayload = { email, nikadmin, pass };
    console.log('Mengirim ke http://localhost:8080/api/user/create dengan data:', signupPayload);

    try {
      // Langkah 1: Registrasi
      const signupResponse = await fetch('http://localhost:8080/api/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupPayload),
      });

      console.log('Signup Status HTTP:', signupResponse.status);
      const signupText = await signupResponse.text();
      console.log('Signup Respons mentah dari server:', signupText);

      let signupData;
      try {
        signupData = JSON.parse(signupText);
        console.log('Signup Respons JSON:', signupData);
      } catch (parseErr) {
        throw new Error('Signup Respons bukan JSON: ' + signupText);
      }

      if (!signupResponse.ok || signupData.code !== 200) {
        setError(signupData.message || 'Registrasi gagal');
        console.log('Registrasi gagal:', signupData.message);
        return;
      }

      // Langkah 2: Login otomatis setelah registrasi berhasil
      const loginPayload = { nikadmin, pass }; // Payload untuk login
      console.log('Mengirim ke http://localhost:8080/api/user/login dengan data:', loginPayload);

      const loginResponse = await fetch('http://localhost:8080/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginPayload),
      });

      console.log('Login Status HTTP:', loginResponse.status);
      const loginText = await loginResponse.text();
      console.log('Login Respons mentah dari server:', loginText);

      let loginData;
      try {
        loginData = JSON.parse(loginText);
        console.log('Login Respons JSON:', loginData);
      } catch (parseErr) {
        throw new Error('Login Respons bukan JSON: ' + loginText);
      }

      if (loginResponse.ok && loginData.data) {
        console.log('Token ditemukan, menyimpan ke cookie:', loginData.data);
        document.cookie = `token=${loginData.data}; path=/; max-age=3600`; // Simpan token di cookie
        console.log('Cookie setelah disimpan:', document.cookie);
        console.log('Redirect ke dashboard');
        window.location.href = '/dashboard'; // Redirect ke halaman utama
      } else {
        setError(loginData.message || 'Login otomatis gagal setelah registrasi');
        console.log('Login otomatis gagal:', loginData.message);
      }
    } catch (err) {
      console.error('Error:', err.message);
      if (err.message === 'Failed to fetch') {
        setError('Gagal terhubung ke server: Pastikan server berjalan di http://localhost:8080');
      } else {
        setError('Gagal memproses respons server: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk membatasi input hanya angka
  const handleNikChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Hanya angka yang diperbolehkan
    if (value.length <= 16) {
      e.target.value = value;
    } else {
      e.target.value = value.slice(0, 16); // Batasi hingga 16 karakter
    }
  };

  return createElement(
    Row,
    { className: 'align-items-center justify-content-center g-0 min-vh-100' },
    createElement(
      Col,
      { xxl: 4, lg: 6, md: 8, xs: 12, className: 'py-8 py-xl-0' },
      createElement(
        Card,
        { className: 'smooth-shadow-md' },
        createElement(
          Card.Body,
          { className: 'p-6' },
          createElement(
            'div',
            { className: 'mb-4 text-center' },
            createElement(Link, { href: '/' }, 
              createElement('img', {
                src: '/images/brand/logo/logo.png',
                className: 'mb-2',
                style: { width: '60px', height: 'auto' },
                alt: 'Logo',
              })
            ),
            createElement('h4', { className: 'mb-1' }, 'Buat Akun Baru'),
            createElement('p', { className: 'mb-6' }, 'Masukkan informasi untuk mendaftar.')
          ),
          createElement(
            Form,
            { onSubmit: handleSubmit },
            createElement(
              Form.Group,
              { className: 'mb-3', controlId: 'email' },
              createElement(Form.Label, null, 'Email'),
              createElement(Form.Control, {
                type: 'email',
                name: 'email',
                placeholder: 'nama@contoh.com',
                required: true,
              })
            ),
            createElement(
              Form.Group,
              { className: 'mb-3', controlId: 'nikadmin' },
              createElement(Form.Label, null, 'NIK'),
              createElement(Form.Control, {
                type: 'text',
                name: 'nikadmin',
                placeholder: '737############',
                required: true,
                maxLength: 16,
                onChange: handleNikChange,
                pattern: '\\d{16}',
                title: 'NIK harus terdiri dari 16 angka',
              })
            ),
            createElement(
              Form.Group,
              { className: 'mb-3', controlId: 'pass' },
              createElement(Form.Label, null, 'Password'),
              createElement(Form.Control, {
                type: 'password',
                name: 'pass',
                placeholder: '**************',
                required: true,
              })
            ),
            error && createElement('p', { className: 'text-danger text-center' }, error),
            createElement(
              'div',
              { className: 'd-grid' },
              createElement(Button, {
                variant: 'primary',
                type: 'submit',
                disabled: loading,
              }, loading ? 'Mendaftar...' : 'Daftar')
            ),
            createElement(
              'div',
              { className: 'text-center mt-4' },
              createElement(
                'p',
                null,
                'Sudah punya akun? ',
                createElement(Link, { href: '/authentication/sign-in', className: 'text-primary' }, 'Login di sini')
              )
            )
          )
        )
      )
    )
  );
}