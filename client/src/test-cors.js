// Script to test CORS from the browser
// Run this in your browser console while on your React app

console.log('Testing CORS from the browser...');

// Test the server directly
fetch('http://localhost:5000/api/test', {
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
})
.then(response => {
  console.log('Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ Success! Direct server response:', data);
})
.catch(error => {
  console.error(' Error connecting directly to server:', error);
});

// Test using the proxy
fetch('/api/test', {
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
})
.then(response => {
  console.log('Proxy response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ Success! Proxy response:', data);
})
.catch(error => {
  console.error(' Error connecting through proxy:', error);
});
