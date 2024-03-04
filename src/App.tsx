import React, { useState, useEffect, useRef } from 'react'
import africaMap from './assets/map_africa.png'
import { collisionHandler } from './collider.tsx'
import {graphTimer, mapHandler, Trajectory, Spawn, spawnHandler, ContextProvider} from './Auxiliary.tsx'
import PhysicsObj from './physicsObj/PhysicsObj.tsx'

export const Context = React.createContext<ContextProvider>()

function App() {
  // 480p resolution
  const resolution: {x: number, y:number} = {x: 640, y: 480}

  // trajectories with z = -1, ensures it does not collide on init
  const [spawns, setSpawns] = useState<Spawn[]>([])
  const [updateSpawns, setUpdateSpawns] = useState<number>(0)
  const [begin, setBegin] = useState<boolean>(false)

  // set the graphic/mechanical timer
  const graphTime:number = graphTimer()

  // sets the map specification, and adjust for dynamic situations
  const map_y = useRef<HTMLInputElement>(null)
  const [masterWidth, masterHeight] = mapHandler(map_y)

  // handle spans creation, destruction and properties
  spawnHandler(spawns, setSpawns, updateSpawns)

  // determine if collision occured and update states
  collisionHandler(spawns, setSpawns, graphTime, masterWidth, masterHeight)

  const toggleBegin = () => {
    setBegin( (begin) => !begin)
  }

  const [initPos, setInitPos] = useState<number[]>([0,0])
  const [finalPos, setFinalPos] = useState<number[]>([0,0])
  const [angle, setAngle] = useState(0);

  const rotateBox = useRef<HTMLInputElement>(null)

  useEffect( () => {
    const diff = [finalPos[0] - initPos[0], initPos[1] - finalPos[1]]
    setAngle((Math.atan2(diff[1], diff[0]) * 57.2958 + 360) % 360)
  }, [finalPos])

  const handleMouseUp = (e:any) => {
    setFinalPos([e.clientX, e.clientY])
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  const handleMouseMove = (e:any) => {
    setFinalPos([e.clientX, e.clientY])
    document.addEventListener('mouseup', handleMouseUp)
  }

  const getAngleDiff = (e:any):void => {
    if (rotateBox.current) {
      setInitPos([rotateBox.current.offsetLeft + rotateBox.current.clientWidth/2,rotateBox.current.offsetTop + rotateBox.current.clientHeight/2])
    }
    document.addEventListener("mousemove", handleMouseMove);
  }

  return (
    <Context.Provider value={{masterWidth, masterHeight, graphTime, begin, spawns}}>
      <div className="flex mt-5 relative z-0">
        <div className="flex-auto overflow-hidden w-2/3 cursor-cell" ref={map_y}>
          {spawns.map( (spawn, index) => (
            <PhysicsObj
              key={index}
              width={75}
              spawn={spawn} setSpawns={setSpawns}
              indexSpawn={index}
              mapWidth={masterWidth} mapHeight={masterHeight}
              begin={begin}
            />
          ))}
          <img src={africaMap} className="scale-150"/>
        </div>
      </div>
      <div className="h-28 w-full bg-zinc-600 flex justify-center">
        <div className='w-32 h-full bg-white m-2' ref={rotateBox} onMouseDown={getAngleDiff} style={{transform: 'rotate(-' + angle + 'deg)'}}>
        </div>
      </div>
      <button className="bg-sky-500 m-4 p-4" onClick={toggleBegin}>begin</button>
    </Context.Provider>
  )
}

export default App