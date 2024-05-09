import { useState } from 'react'
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { BiMath } from "react-icons/bi";
import 'react-toastify/dist/ReactToastify.css';
import { useIdleTimer } from 'react-idle-timer'


const timeout = 10_000
const promptBeforeIdle = 4_000
function App() {
  const [state, setState] = useState<string>('Active')
  const [remaining, setRemaining] = useState<number>(timeout)
  const [open, setOpen] = useState<boolean>(false)
  const [count, setCount] = useState(0)
  const notify = () => toast.info(`🦄 Count is now ${count + 1}`);

  const onIdle = () => {
    setState('Idle')
    setOpen(false)
  }

  const onActive = () => {
    setState('Active')
    setOpen(false)
  }

  const onPrompt = () => {
    setState('Prompted')
    setOpen(true)
  }

  const { getRemainingTime, activate } = useIdleTimer({
    onIdle,
    onActive,
    onPrompt,
    timeout,
    promptBeforeIdle,
    throttle: 500
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.ceil(getRemainingTime() / 1000))
    }, 500)

    return () => {
      clearInterval(interval)
    }
  })

  const handleStillHere = () => {
    activate()
  }

  const timeTillPrompt = Math.max(remaining - promptBeforeIdle / 1000, 0)
  const seconds = timeTillPrompt > 1 ? 'seconds' : 'second'

  return (
    <div>
      <h1>Counter <BiMath  style={{ verticalAlign: 'middle', color: 'red' }}/> </h1>
      <div className="card">
        
        <button className='counter-btn' onClick={() => {
          setCount((count) => count + 1)
         {notify()}
        }}>
         count is {count}
        </button>

        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
          theme="light"      
        />
        
        <p>Current State: {state}</p>
      {timeTillPrompt > 0 && (
        <p>
          {timeTillPrompt} {seconds} until prompt
        </p>
        )}
        
        <div
        className="modal"
        style={{
          display: open ? 'flex' : 'none'
        }}
        >
          <h4>Are you still here?</h4>
        <p>Logging out in {remaining} seconds</p>
        <button className='modal-btn' onClick={handleStillHere}>Im still here</button>
      </div>
      </div>
  
    </div>
  )
}

export default App
