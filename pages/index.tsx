import type { NextPage } from 'next'
import { FormEvent, useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { io } from "socket.io-client"
import random from "random-name"

type Chat = {
  reciver: string;
  sender: string;
  content: string;
};

const Home: NextPage = () => {
  
  const [myName, setMyName] = useState("")
  const [state, setState] = useState<"connect"|"disconect">("disconect");
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [chat, setChat] = useState<Chat[]>([]);
  const [socket, setSocket] = useState(io('ws://localhost:3333'))
  
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const newChat: Chat = {
      reciver: name,
      sender: myName,
      content: text
    }

    socket.emit("chat", newChat)
    setText("")
  }

  useEffect(() => {
    socket.on("connect", () => {
      setState("connect")
    })
    socket.on(`chat-${myName}`, args => {
      setChat([args, ...chat])
    })

    return () => {
      socket.off("connect")
      socket.off(`chat-${myName}`)
    }
  }, [chat, myName])

  return (
    <div className={styles.container}>
      <h1>{state}: {myName}</h1>
      <button onClick={() => setMyName(random.first())}>change name</button>
      <h2>name</h2>
      <input value={name} type="text" onChange={e => setName(e.target.value)} />
      <button>send</button>
      <h2>text</h2>
     <form onSubmit={handleSubmit} action="">
      <input value={text} type="text" onChange={e => setText(e.target.value)}/>
      <button>send</button>
     </form>
     <ul>
        {
          chat.map((c, i) => (
            <li key={i}>
              <strong>
                {c.sender}:
              </strong>
              {c.content}
            </li>
          ))
        }
     </ul>
    </div>
  )
}

export default Home
