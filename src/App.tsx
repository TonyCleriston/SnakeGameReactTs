import { useEffect, useRef, useState } from 'react'
import useInterval from "./hooks/useInterval"
import AppleLogo from "./assets/applePixels.png"
import Monitor from "./assets/oldMonitor.png"
import "./App.css"

const canvasX = 1000
const canvasY = 1000
const initialSnake = [[4, 10], [4, 10]]
const initialApple = [14, 10]
const scale = 50
const timeDelay = 100
function App() {

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [snake, setSnake] = useState(initialSnake)
  const [apple, setApple] = useState(initialApple)
  const [direction, setDirection] = useState([0, -1])
  const [delay, setDelay] = useState<number | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  useInterval(() => runGame(), delay)
  function play() {
    setSnake(initialSnake)
    setApple(initialApple)
    setDirection([1, 0])
    setDelay(timeDelay)
    setScore(0)
    setGameOver(false)
  }
  useEffect(
		() => {
			let fruit = document.getElementById("fruit") as HTMLCanvasElement
			if (canvasRef.current) {
				const canvas = canvasRef.current
				const ctx = canvas.getContext("2d")
				if (ctx) {
					ctx.setTransform(scale, 0, 0, scale, 0, 0)
					ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
					ctx.fillStyle = "#a3d001"
					snake.forEach(([ x, y ]) => ctx.fillRect(x, y, 1, 1))
					ctx.drawImage(fruit, apple[0], apple[1], 1, 1)
				}
			}
		},
		[ snake, apple, gameOver ]
	)

  function handleSetScore() {
    if (score > Number(localStorage.getItem('highScore'))) {
      localStorage.setItem('highScore', JSON.stringify(score))
    }
  }
  function checkCollision(head: number[]) {
    for (let i = 0; i < head.length; i++) {
      if (head[i] < 0 || head[i] * scale >= canvasX) {
        return true
      }

    }
    for (const s of snake) {
      if (head[0] === s[0] && head[1] === s[1]) {
        return true
      }
    }
    return false
  }
  function appleAte(newSnake: number[][]) {
    let coord = apple.map(() => Math.floor(Math.random() * canvasX / scale))
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = coord
      setScore(score + 1)
      setApple(newApple)
      return true
    }
    return false
  }
  function changeDirection(e: React.KeyboardEvent<HTMLDivElement>) {
    console.log(e.key)
    switch (e.key) {
      case "a":
        setDirection([-1, 0])
        break
      case "w":
        setDirection([0, -1])
        break
      case "d":
        setDirection([1, 0])
        break
      case "s":
        setDirection([0, 1])
        break
    }
  }
  function runGame() {
    const newSnake = [...snake]
    const newSnakeHead = [newSnake[0][0] + direction[0], newSnake[0][1] + direction[1]]
    newSnake.unshift(newSnakeHead)
    if (checkCollision(newSnakeHead)) {
      setDelay(null)
      setGameOver(true)
      handleSetScore()
    }
    if (!appleAte(newSnake)) {
      newSnake.pop()
    }
    setSnake(newSnake)
  }
  return (
    <div onKeyDown={(e) => changeDirection(e)}>
      <h1>Snake Game</h1>
      <img src={AppleLogo} alt="fruta" width='30' id='fruit' />
      <img src={Monitor} alt="monitor" width='4000' className='monitor' />
      <canvas className='playArea' ref={canvasRef} width={`${canvasX}px`} height={`${canvasY}px`}></canvas>
      {gameOver && <div className='gameOver'>Game Over</div>}
      <button onClick={play} className='playButton'>Play</button>
      <div className="scoreBox">
        <h2>Score: {score}</h2>
        <h2>High Score: {localStorage.getItem('highScore')}</h2>
      </div>
    </div>
  )
}

export default App
