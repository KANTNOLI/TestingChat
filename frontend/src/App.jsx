import io from 'socket.io-client';
import './App.css'
import { useEffect, useState } from 'react';

const socket = io.connect("http://localhost:3001")

function App() {


  const [input, setInput] = useState('')
  let name = `Name${Math.random() * (100 - 0) + 0}`;
  let room = "room1"

  const [data, setData] = useState('')

  let join = () => {
    socket.emit("join", {
      room: room,
      name: name,
      messeage: `Зашел ${name}`,
    })
  }


  useEffect(() => {
    socket.on("join", (props) => {
      data ?
        setData([...data, props]) : setData(props)
    })

    socket.on("give", (props) => {
      console.log(props);
      data ?
        setData([...data, props]) : setData(props)
    })
  }, [socket])

  const send = () => {
    socket.emit("send", {
      room: room,
      data: JSON.stringify([...data, {
        room: room,
        name: name,
        messeage: input,
      }]),
      name: name
    })
    setData([...data, {
      room: room,
      name: name,
      messeage: input,
    }])
    setInput("")
  }

  function a(event) {
    setInput(event.target.value)
  }

  return (
    <div>
      <button onClick={() => join()}>Join</button>
      <div className='a'>
        <div className='chats'>
          <div className="chat">s</div>
          <div className="chat">s</div>
          <div className="chat">s</div>
        </div>

        <div className='content'>
          {data &&
            data.map((user, id) => (
              user ?
                <div key={id} className={user === name ? "messeage1" : "messeage2"}>
                  <p>{user.name}</p>
                  <p>{user.messeage}</p>
                </div> : ""
            ))
          }
        </div>
        <input onChange={() => a(event)} value={input} type="text" />
        <button onClick={() => send()} className='send'>send</button>
      </div>
    </div>
  );
}

export default App
