import React, { useState } from 'react';
import './ChatbotPage.css'; // 스타일을 추가할 경우 이 파일을 생성하고 스타일을 정의합니다.

const ChatbotPage = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8080/api/trash/classify/item=${encodeURIComponent(input)}`);
      const data = await res.text();
      setResponse(data);
    } catch (error) {
      setResponse('챗봇 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="chatbot-container">
      <h1>챗봇</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="쓰레기 항목을 입력하세요..."
          required
        />
        <button type="submit">전송</button>
      </form>
      {response && <div className="chatbot-response">{response}</div>}
    </div>
  );
};

export default ChatbotPage;
