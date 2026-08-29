import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('=== REACT ERROR BOUNDARY ===');
    console.error('Error:', error);
    console.error('Stack:', error?.stack);
    console.error('Component Stack:', errorInfo?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      const errMsg = this.state.error?.message || 'Unknown error';
      const errStack = this.state.error?.stack || '';
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0B0F17',
          color: '#F1F5F9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'monospace',
          textAlign: 'center'
        }}>
          <div style={{ color: '#38a9f6', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Rohit Curiosity — Error
          </div>
          <div style={{
            backgroundColor: '#111726',
            border: '1px solid #1F293D',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            maxWidth: '80vw',
            textAlign: 'left',
            marginBottom: '1.5rem',
            overflowX: 'auto'
          }}>
            <p style={{ color: '#f87171', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {errMsg}
            </p>
            <pre style={{ color: '#94A3B8', fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
              {errStack}
            </pre>
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#0e8ce4',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
