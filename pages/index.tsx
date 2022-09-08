import type { NextPage } from 'next'
import { FormEvent, useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { io } from "socket.io-client"

type ToDo = {
  id: number;
  text: string;
  done: boolean;
};

const Home: NextPage = () => {
  
  const [state, setState] = useState<"connect"|"disconect">("disconect");
  const [text, setText] = useState("");
  const [message, setMessage] = useState<string[]>([]);
  const [socket, setSocket] = useState(io('ws://localhost:3333'))
  const [toDos, setTodos] = useState<ToDo[]>([])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    event.stopPropagation()
    socket.emit("add", text)
    setText("")
  }

  useEffect(() => {
    socket.on("connect", () => {
      setState("connect")
    })
    socket.on("update", args => {
      setTodos(args)
    })

    return () => {
      socket.off("connect")
      socket.off("update")
    }
  }, [toDos])


  const handleToggle = (id: number) => {
    socket.emit("toggle", id)
  }


  return (
    <div className={styles.container}>
      <h1>{state}</h1>
     <form onSubmit={handleSubmit} action="">
      <input value={text} type="text" onChange={e => setText(e.target.value)}/>
      <button>send</button>
     </form>
     <ul>
        {
          toDos.map((todo) => (
            <li key={todo.id}>
              {todo.text}
              <button onClick={() => handleToggle(todo.id)} >{todo.done?"done":"undone"}</button>
            </li>
          ))
        }
     </ul>
    </div>
  )
}

export default Home
