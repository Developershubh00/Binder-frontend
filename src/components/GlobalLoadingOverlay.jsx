import { useEffect, useState } from 'react';
import { useLoading } from '../context/LoadingContext';
import PolyhedraAnimation from './PolyhedraAnimation';

const GlobalLoadingOverlay = () => {
  const { isLoading } = useLoading();
  const [animSize, setAnimSize] = useState(() =>
    Math.min(380, Math.max(220, Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.35)))
  );

  useEffect(() => {
    const handleResize = () => {
      setAnimSize(
        Math.min(380, Math.max(220, Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.35)))
      );
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isLoading) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1500,
        background: 'rgba(15, 18, 24, 0.55)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        pointerEvents: 'all',
      }}
    >
      <PolyhedraAnimation size={animSize} />
      <div
        style={{
          color: '#ffffff',
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: '0.04em',
          textShadow: '0 1px 8px rgba(0,0,0,0.4)',
        }}
      >
        Loading...
      </div>
    </div>
  );
};

export default GlobalLoadingOverlay;
