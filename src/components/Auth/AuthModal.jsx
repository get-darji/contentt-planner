import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles } from 'lucide-react';

export const AuthModal = () => {
  const { signInWithGoogleCredential, isAuthenticated } = useAuth();
  const googleButtonRef = useRef(null);
  const [authError, setAuthError] = useState('');
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (isAuthenticated || !googleClientId) return;

    const initializeGoogleSignIn = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) return false;

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: ({ credential }) => {
          try {
            signInWithGoogleCredential(credential);
          } catch (error) {
            setAuthError('Google sign-in succeeded, but the profile could not be read.');
          }
        }
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'rectangular',
        text: 'continue_with',
        width: 320
      });

      return true;
    };

    if (initializeGoogleSignIn()) return;

    const intervalId = window.setInterval(() => {
      if (initializeGoogleSignIn()) {
        window.clearInterval(intervalId);
      }
    }, 200);

    return () => window.clearInterval(intervalId);
  }, [googleClientId, isAuthenticated, signInWithGoogleCredential]);

  if (isAuthenticated) return null;

  const handleMissingClientId = () => {
    if (!googleClientId) {
      setAuthError('Add VITE_GOOGLE_CLIENT_ID to your environment, then restart the app.');
    }
  };

  return (
    <div className="modal-overlay" style={{ background: 'rgba(9, 13, 22, 0.92)' }}>
      <div className="modal-container" style={{ maxWidth: '440px', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'var(--brand-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={28} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            Sign in to Darji
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
            Continue with your Google account to access the content planner.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }} onClick={handleMissingClientId}>
          {googleClientId ? (
            <div ref={googleButtonRef} />
          ) : (
            <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              Configure Google Sign-In
            </button>
          )}
        </div>

        {authError && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 12px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, marginTop: '18px' }}>
            {authError}
          </div>
        )}
      </div>
    </div>
  );
};
