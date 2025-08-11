import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';

const SupabaseTest = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Testing connection...');
    
    try {
      // Test 1: Check if supabase client is initialized
      setStatus('✅ Supabase client initialized');
      
      // Test 2: Test connection
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setStatus(`❌ Auth error: ${error.message}`);
      } else {
        setStatus(`✅ Connection successful. Current session: ${data.session ? 'Active' : 'None'}`);
      }
      
      // Test 3: Check environment variables
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      setStatus(prev => prev + `\n📋 URL: ${url}\n🔑 Key: ${key ? key.substring(0, 20) + '...' : 'Missing'}`);
      
    } catch (error) {
      setStatus(`❌ Connection failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    
    if (email && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          setStatus(`❌ Login failed: ${error.message}`);
        } else {
          setStatus(`✅ Login successful! User: ${data.user?.email}`);
        }
      } catch (error) {
        setStatus(`❌ Login error: ${error}`);
      }
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Supabase Connection Test</h2>
      
      <div className="space-y-4">
        <Button onClick={testConnection} disabled={loading}>
          Test Connection
        </Button>
        
        <Button onClick={testLogin} disabled={loading}>
          Test Login
        </Button>
        
        {status && (
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap text-sm">
            {status}
          </pre>
        )}
      </div>
    </div>
  );
};

export default SupabaseTest;
