import io from 'socket.io-client';
import './App.css'
import { useEffect, useState } from 'react';

const socket = io.connect("http://localhost:3001")

function App() {

  const [data, setData] = useState([''])
  const [input, setInput] = useState('')



  useEffect(() => {
    socket.on("give", (data) => {
      setData(data)
    })
  }, [socket])

  const send = () => {
    socket.emit("send", [...data, input])
  }

  function a(event) {
    setInput(event.target.value)
  }

  return (
    <div>
      {
        data.map((messeage, id) => (
          <p key={id}>{messeage}</p>
        ))
      }
      <input value={input} onChange={() => a(event)} type="text" placeholder='mass' />
      <button onClick={() => send()}>send</button>
    </div >
  );
}

export default App
