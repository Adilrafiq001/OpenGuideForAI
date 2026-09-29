import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../styles/not-found.css';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-card" role="region" aria-label="Page Not Found">
        {/* Ambient background orbs */}
        <div className="not-found-orb not-found-orb--1" />
        <div className="not-found-orb not-found-orb--2" />
        <div className="not-found-orb not-found-orb--3" />

        <div className="not-found-error-container">
          <div className="not-found-error-code">404</div>
          <h1 className="not-found-error-msg">Signal Lost in Vector Space</h1>
          <p className="text-sm max-w-sm mx-auto mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            The coordinate you requested does not exist in OpenGuide's curriculum graph or studio manifold.
          </p>
          <Link to="/" className="not-found-home-btn" id="not-found-return-home">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Studio Launchpad</span>
          </Link>
        </div>

        {/* Animated Mechanical Duck */}
        <div className="duck__wrapper" aria-hidden="true">
          <div className="duck">
            <div className="duck__inner">
              <div className="duck__head">
                <div className="duck__white" />
                <div className="duck__eye" />
                <div className="duck__mouth" />
              </div>
              <div className="duck__body">
                <div className="duck__wing" />
              </div>
            </div>
            <div className="duck__foot duck__foot--1" />
            <div className="duck__foot duck__foot--2" />
            <div className="not-found-surface" />
          </div>
        </div>
      </div>
    </div>
  );
};
