import { useEffect, useState } from 'react'
import io from 'socket.io-client';
import './App.css'

function App() {
  const [count, setCount] = useState(0)


  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const socket = io();

  useEffect(() => {
    // Подписываемся на событие 'message' при монтировании компонента
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Отписываемся от события при размонтировании компонента
    return () => {
      socket.off('message');
    };
  }, []); // Зависимость пуста, так что useEffect вызывается только один раз при монтировании

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    if (messageInput.trim() !== '') {
      socket.emit('message', messageInput);
      setMessageInput('');
    }
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <form onSubmit={handleMessageSubmit}>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Введите ваше сообщение"
        />
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
};

export default App
