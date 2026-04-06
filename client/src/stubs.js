// src/stubs.js
import React from 'react';

// Generic placeholder component
export const DashboardCard = () => <div style={{padding: '1rem', border: '1px solid gray'}}>DashboardCard Placeholder</div>;
export const Loader = () => <div style={{padding: '1rem'}}>Loader Placeholder</div>;
export const Table = () => <div style={{padding: '1rem', border: '1px dashed gray'}}>Table Placeholder</div>;
export const Signup = () => <div style={{padding: '1rem'}}>Signup Page Placeholder</div>;
export const Verify = () => <div style={{padding: '1rem'}}>Verify Page Placeholder</div>;

// Default export (optional)
export default {
  DashboardCard,
  Loader,
  Table,
  Signup,
  Verify
};