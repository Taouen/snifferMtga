import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/main.css';

console.log('🔥 React is starting...'); // ADD THIS LINE

const rootElement = document.getElementById('root'); // ✅ Make sure this is not null
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
