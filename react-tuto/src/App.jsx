
import React from 'react'
import { useEffect, useState } from 'react'

function App() {

     const [duration, setDuration] = useState(5)
     const [secondsLeft, setSecondsLeft] = useState(duration)

     useEffect(() => {
        setInterval(() => {
          setSecondsLeft(v => v-1)
        }, 1000)
      }, [duration]);

      return <div className="vstack gap-2">
        <input
          value={duration}
          onChange={setDuration}
          placeholder="Timer..."
          />

        <p>
          Decompte : {secondsLeft}
        </p>
      </div>
  
}
export default App