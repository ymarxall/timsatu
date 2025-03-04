'use client';

import { useEffect, useState, Fragment } from 'react';
import { Container, Col, Row, Button } from 'react-bootstrap';
import { StatRightTopIcon } from "widgets";
import ProjectsStatsData from "data/dashboard/ProjectsStatsData";

const getCookie = (name) => {
  if (typeof document !== "undefined") {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  return null;
};

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = getCookie('token');
      if (!token) {
        window.alert("Anda harus login sebagai admin");
        window.location.href = '/';
      } else {
        fetch('http://localhost:8080/api/user', {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Gagal mengambil data pengguna');
            }
            return response.json();
          })
          .then(data => {
            console.log('Data dari API /api/user:', data); // Debugging
            if (data.data && data.data.length > 0) {
              setUserData(data.data[0]); // Ambil user pertama
              console.log('User Data yang Diset:', data.data[0]); // Debugging
            } else {
              setUserData({ nikadmin: 'Admin' }); 
            }
            setLoading(false);
          })
          .catch(err => {
            console.error('Kesalahan mengambil data pengguna:', err);
            setUserData({ nikadmin: 'Admin' });
            setLoading(false);
          });
      }
    }
  }, []);

  useEffect(() => {
    console.log('userData Terbaru:', userData); // Debugging state
  }, [userData]);

  const handleLogout = () => {
    document.cookie = 'token=; path=/; max-age=0';
    window.location.href = '/';
  };

  return (
    <Fragment>
      <div style={{ backgroundColor: '#1a73e9', paddingTop: '10%', paddingBottom: '5.25rem' }}></div>
      <Container fluid className="mt-n22 px-6">
        <Row>
          <Col lg={12} md={12} xs={12}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="mb-2 mb-lg-0">
                <h3 className="mb-0 text-white">Pelayanan Publik</h3>
              </div>
            </div>
          </Col>

          {ProjectsStatsData.map((item, index) => (
            <Col xl={3} lg={6} md={12} xs={12} className="mt-6" key={index}>
              <StatRightTopIcon info={item} />
            </Col>
          ))}
        </Row>
      </Container>

      {/* Profil dan Tombol Keluar di Kanan Bawah */}
      <div
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 1000,
          backgroundColor: '#f0f0f0',
          padding: '8px 12px',
          borderRadius: '8px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Tampilan Profil */}
        <span style={{ color: 'black', fontSize: '14px', fontWeight: 'bold' }}>
          {loading ? 'Memuat...' : (userData?.nikadmin || 'Admin')}
        </span>

        {/* Tombol Keluar */}
        <Button
          variant="secondary"
          size="sm"
          onClick={handleLogout}
        >
          Keluar
        </Button>
      </div>
    </Fragment>
  );
}