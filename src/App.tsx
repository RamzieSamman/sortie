import React, { useState, useEffect, useRef } from 'react'
import africaMap from './assets/map_africa.png'
import Plane from './planes/Plane.tsx'
import Missile from './missiles/Missile.tsx'
import collision from './collider.tsx'
import {graphTimer, mapHandler, Trajectory} from './Auxiliary.tsx'

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
  const resolution = {x: 640, y: 480}

  // trajectories with z = -1, ensures it does not collide on init
  const [missileTrajectory, setMissileTrajectory] = useState<Trajectory>({x: 0, y: 0, z: -1, width: 0, height: 0, exploded: false, type: 'missile'})
  const [planeTrajectory, setPlaneTrajectory] = useState<Trajectory>({x: 0, y: 0, z: -1, width: 0, height: 0, exploded: false, type: 'plane'})

  // sets the map specification, and adjust for dynamic situations
  const map_y = useRef<HTMLInputElement>(null)
  const [masterWidth, masterHeight] = mapHandler(map_y)

  // set the graphic/mechanical timer
  const graphTime:number = graphTimer()

  // determine if collision occured and update states
  useEffect(() => {
    const colliders: Trajectory[] = [missileTrajectory, planeTrajectory]
    collision(colliders, setMissileTrajectory, setPlaneTrajectory)
  }, [graphTime])

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
          <Plane width={75} exploded={planeTrajectory.exploded} />
          <Missile width={75} exploded={missileTrajectory.exploded}/>
          <img src={africaMap} className="scale-150"/>
        </div>
      </div>
    </Context.Provider>
  )
}

export default App