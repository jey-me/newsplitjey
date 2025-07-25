import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ padding: '32px', textAlign: 'center' }}>
      <h2>404 – Page Not Found</h2>
      <p>The page you’re looking for doesn’t exist.</p>
      <Link to="/">Go back home</Link>
    </div>
  );
}
