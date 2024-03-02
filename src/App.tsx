import React, { useState, useEffect, useRef } from 'react'
import africaMap from './assets/map_africa.png'
import { collisionHandler } from './collider.tsx'
import {graphTimer, mapHandler, Trajectory, Spawn, spawnHandler} from './Auxiliary.tsx'
import PhysicsObj from './PhysicsObj.tsx'

interface ContextProvider {
  masterWidth: number,
  masterHeight: number,
  setMissileTrajectory: any,
  setPlaneTrajectory: any,
  graphTime: number,
  missileTrajectory: Trajectory,
  planeTrajectory: Trajectory
}

export const Context = React.createContext<ContextProvider>()

function App() {
  // 480p resolution
  const resolution: {x: number, y:number} = {x: 640, y: 480}

  // trajectories with z = -1, ensures it does not collide on init
  const [missileTrajectory, setMissileTrajectory] = useState<Trajectory>({x: 0, y: 0, z: -1, width: 0, height: 0, exploded: false, type: 'missile'})
  const [planeTrajectory, setPlaneTrajectory] = useState<Trajectory>({x: 0, y: 0, z: -1, width: 0, height: 0, exploded: false, type: 'plane'})
  const [spawns, setSpawns] = useState<Spawn[]>([])
  const [updateSpawns, setUpdateSpawns] = useState(0)

  // set the graphic/mechanical timer
  const graphTime:number = graphTimer()

  // sets the map specification, and adjust for dynamic situations
  const map_y = useRef<HTMLInputElement>(null)
  const [masterWidth, masterHeight] = mapHandler(map_y)

  // handle spans creation, destruction and properties
  spawnHandler(spawns, setSpawns, updateSpawns)

  // determine if collision occured and update states
  collisionHandler(spawns, setSpawns, graphTime)

  return (
    <Context.Provider value={{
      masterWidth,
      masterHeight,
      setMissileTrajectory,
      setPlaneTrajectory,
      graphTime,
      missileTrajectory,
      planeTrajectory
    }}>
      <div className="flex mt-5 relative z-0">
        <div className="flex-auto overflow-hidden w-2/3" ref={map_y}>
          {spawns.map( (spawn, index) => (
            <PhysicsObj
            key={index}
            width={75}
            spawn={spawn} setSpawns={setSpawns}
            indexSpawn={index}
            />
          ))}
          <img src={africaMap} className="scale-150"/>
        </div>
      </div>
    </Context.Provider>
  )
}

export default App