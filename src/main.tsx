import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root')!;
// @ts-expect-error - Guard for HMR double-initialization
let root = window.__reactRoot;
if (!root) {
  root = createRoot(container);
  // @ts-expect-error
  window.__reactRoot = root;
}

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
