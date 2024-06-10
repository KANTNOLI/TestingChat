import io from 'socket.io-client';
import axios from "axios"
import './App.css'
import { useEffect, useState } from 'react';

const socket = io.connect("http://localhost:3001")

function App() {
  const [user, setUser] = useState('')
  const [chatId, setChatId] = useState(0)
  const [room, setRoom] = useState('room1')
  const [messeage, setMesseages] = useState('')

  //инпуты
  const [inputMessage, setInputMessage] = useState('')
  function setMessage(event) {
    setInputMessage(event.target.value)
  }
  const [inputName, setInputName] = useState('test1')
  function setName(event) {
    setInputName(event.target.value)
  }
  //инпуты


  useEffect(() => {
    axios.get(`http://localhost:5001/users?name=${inputName}`)
      .then((response) => {
        setUser(response.data)
      })

    socket.on("give", (props) => {
      join(props.name, props.id)
    })



  }, [inputName, socket])

  const send = () => {
    socket.emit("send", {
      //id: 1,
      chatid: messeage[0].chatid,
      senderid: user[0].id,
      content: inputMessage,
      metadata: null,
      //
      room: room,
    })
    setInputMessage("")
    setMesseages([
      ...messeage,
      {
        chatid: messeage[0].chatid,
        senderid: user[0].id,
        content: inputMessage,
        metadata: null
      }]
    )
  }




  let join = (name, id) => {
    socket.emit("join", name)
    setChatId(id)
    setRoom(name)
    axios.get(`http://localhost:5001/messages?id=${id}`)
      .then((response) => {
        setMesseages(response.data)
      })
  }

  return (
    <div>
      <input className='test' onChange={() => setName(event)} value={inputName} type="text" placeholder="name" />
      <div className='a'>
        <div className='chats'>
          {user &&
            user.map((chat, id) => (
              <div onClick={() => join(chat.name, chat.chatid)} key={id} className="chat">{chat.name}</div>
            ))
          }
        </div>

        <div className='content'>
          {messeage && user[0] &&
            messeage.map((message, id) => (
              <div key={id} className={message.senderid != user[0].id ? "messeage1" : "messeage2"}>
                <p>{message.content}</p>
              </div>
            ))
          }
        </div>
        <input onChange={() => setMessage(event)} value={inputMessage} type="text" />
        <button onClick={() => send()} className='send'>send</button>
      </div>
    </div>
  );
}

export default App
