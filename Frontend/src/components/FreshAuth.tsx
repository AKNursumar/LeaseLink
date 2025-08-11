import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const FreshAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login' 
        ? { email, password }
        : { email, password, fullName };

      console.log(`🔄 Attempting ${mode} with:`, body);

      const response = await fetch(`http://localhost:4000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (data.success) {
        setResult(`✅ ${mode === 'login' ? 'Login' : 'Registration'} successful!\nUser: ${data.user.email}`);
        if (data.session) {
          setResult(prev => prev + `\nToken: ${data.session.access_token.substring(0, 20)}...`);
        }
      } else {
        setResult(`❌ ${mode === 'login' ? 'Login' : 'Registration'} failed: ${data.error}\nDetails: ${data.details || 'No details'}`);
      }
    } catch (error) {
      console.error('Request error:', error);
      setResult(`❌ Request failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testBackend = async () => {
    setLoading(true);
    setResult('');

    try {
      console.log('🔄 Testing backend connection...');
      
      // Test basic endpoint
      const testResponse = await fetch('http://localhost:4000/api/test');
      const testData = await testResponse.json();
      
      // Test Supabase endpoint
      const supabaseResponse = await fetch('http://localhost:4000/api/test-supabase');
      const supabaseData = await supabaseResponse.json();

      setResult(`✅ Backend Test Results:
📡 Basic: ${testData.message}
📊 Supabase: ${supabaseData.success ? `Connected! Found ${supabaseData.usersCount} users` : 'Failed'}
🕒 Timestamp: ${testData.timestamp}`);

    } catch (error) {
      console.error('Test error:', error);
      setResult(`❌ Backend test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Fresh Auth Test</h2>
      
      {/* Mode Toggle */}
      <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
        <button
          className={`flex-1 py-2 px-4 rounded-md ${mode === 'login' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md ${mode === 'register' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
          onClick={() => setMode('register')}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        {mode === 'register' && (
          <Input
            type="text"
            placeholder="Full Name (optional)"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        )}
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Register')}
        </Button>
      </form>

      <div className="mt-4 space-y-2">
        <Button onClick={testBackend} disabled={loading} variant="outline" className="w-full">
          Test Backend Connection
        </Button>
      </div>

      {result && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
};

export default FreshAuth;
