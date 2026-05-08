"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ArrowRight, Shield, Zap, Layout } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={40} color="var(--primary)" />
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
      <div style={{ maxWidth: '800px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '20px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '24px' }}>
          <Zap size={14} /> NEW: Scalable Architecture
        </div>
        
        <h1 style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px' }}>
          Manage Tasks with <span className="gradient-text">Unmatched Security</span>
        </h1>
        
        <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', marginBottom: '40px', lineHeight: '1.6' }}>
          Primetrade.ai Secure Hub provides a professional-grade environment for your team. 
          Experience role-based access, JWT security, and a sleek, modern interface.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '80px' }}>
          <Link href="/register" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
            Get Started <ArrowRight size={20} />
          </Link>
          <Link href="/login" className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
            Sign In
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
          <div className="glass-card" style={{ padding: '32px', textAlign: 'left' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '12px', width: 'fit-content', marginBottom: '20px' }}>
              <Shield size={24} color="var(--primary)" />
            </div>
            <h3 style={{ marginBottom: '12px' }}>Secure Auth</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>JWT authentication with encrypted password hashing.</p>
          </div>
          
          <div className="glass-card" style={{ padding: '32px', textAlign: 'left' }}>
            <div style={{ background: 'rgba(167, 139, 250, 0.1)', padding: '12px', borderRadius: '12px', width: 'fit-content', marginBottom: '20px' }}>
              <Layout size={24} color="#a78bfa" />
            </div>
            <h3 style={{ marginBottom: '12px' }}>Role-Based</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>Granular control for users and administrators.</p>
          </div>

          <div className="glass-card" style={{ padding: '32px', textAlign: 'left' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '12px', width: 'fit-content', marginBottom: '20px' }}>
              <Zap size={24} color="var(--success)" />
            </div>
            <h3 style={{ marginBottom: '12px' }}>Fast API</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>High-performance RESTful services built with TypeScript.</p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
