import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Fetch questions from your backend
    axios.get('http://localhost:5000/api/questions')
      .then(res => setQuestions(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cybersecurity Awareness Quiz</h1>
      {questions.map((q, index) => (
        <div key={index} className="mb-6">
          <p className="font-semibold">{q.question}</p>
          <ul className="ml-4 list-disc">
            {q.options.map((opt, i) => (
              <li key={i}>{opt}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;