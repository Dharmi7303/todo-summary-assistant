/**
 * Test API service with minimal configuration
 * Run this in your browser console to test connection
 * with both direct and proxy methods
 */

// Method 1: Using the proxy
export const testProxyConnection = async () => {
  try {
    const response = await fetch('/api/test');
    const data = await response.json();
    console.log('Proxy test result:', data);
    return data;
  } catch (error) {
    console.error('Proxy test failed:', error);
    return null;
  }
};

// Method 2: Direct connection
export const testDirectConnection = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/test', {
      mode: 'cors',
      headers: {
        'Origin': 'http://localhost:3000'
      }
    });
    const data = await response.json();
    console.log('Direct test result:', data);
    return data;
  } catch (error) {
    console.error('Direct test failed:', error);
    return null;
  }
};

// Run tests automatically
console.log('Running API connectivity tests...');
testProxyConnection().then(() => console.log('Proxy test complete'));
testDirectConnection().then(() => console.log('Direct test complete'));
