import React, { useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');
  const [isSpam, setIsSpam] = useState(null); // for dynamic color

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (data.prediction) {
        setResult(data.prediction);
        setIsSpam(data.prediction === 'Spam');
      } else {
        setResult('Error: ' + (data.error || 'Unexpected response'));
        setIsSpam(null);
      }
    } catch (error) {
      setResult('Error: Could not connect to backend');
      setIsSpam(null);
    }
  };

  return (
    <div className="App">
      <h1>Spam Email Classifier</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="6"
          cols="60"
          placeholder="Enter your email content..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <br />
        <button type="submit">Check</button>
      </form>

      {result && (
        <h2 className={isSpam === null ? '' : isSpam ? 'spam' : 'not-spam'}>
          Result: {result}
        </h2>
      )}
    </div>
  );
}

export default App;
