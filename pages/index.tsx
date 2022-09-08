import type { NextPage } from 'next'
import { FormEvent, useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { io } from "socket.io-client"


const Home: NextPage = () => {
  
  const [state, setState] = useState<"connect"|"disconect">("disconect");
  const [text, setText] = useState("");
  const [message, setMessage] = useState<string[]>([]);
  const [socket, setSocket] = useState(io('ws://localhost:3333'))

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    event.stopPropagation()
    socket.emit("message", text)
    setText("")
  }

  useEffect(() => {
    socket.on("connect", () => {
      setState("connect")
    })
    socket.on('message', args => {
      setMessage([args, ...message])
    });

    return () => {
      socket.off("connect")
      socket.off("message")
    }
  }, [message])




  return (
    <div className={styles.container}>
      <h1>{state}</h1>
     <form onSubmit={handleSubmit} action="">
      <input value={text} type="text" onChange={e => setText(e.target.value)}/>
      <button>send</button>
     </form>
     <ul>
        {
          message.map((value, i) => (
            <li key={i}>
              {value}
            </li>
          ))
        }
     </ul>
    </div>
  )
}

export default Home
