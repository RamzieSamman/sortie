import React, { useState, useEffect, useRef } from 'react'
import africaMap from './assets/map_africa.png'
import Plane from './plane.tsx'
import Missile from './Missile.tsx'
import collision from './collider.tsx'
import { useContext } from 'react';

export const Context = React.createContext()

function App() {
  // 480p resolution
  const resolution = {x: 640, y: 480}

  // master width and master height of the map
  const [masterWidth, setMasterWidth] = useState(window.innerWidth)
  const [masterHeight, setMasterHeight] = useState(0)
  const [missileTrajectory, setMissileTrajectory] = useState({x: 0, y: 0, z: -1, width: 0, height: 0, exploded: false, type: 'missile'})
  const [planeTrajectory, setPlaneTrajectory] = useState({x: 0, y: 0, z: -1, width: 0, height: 0, exploded: false, type: 'plane'})

  // set the master width of the map
  useEffect(() => {
      // upon resize of window, change the masterSize variable
      const handleResize = () => {
        setMasterWidth(window.innerWidth)
      }
      // add an event event listener on mount.
      window.addEventListener('resize', handleResize);
      // unmount cleanup
      return () => {
         window.removeEventListener('resize', handleResize);
      };
    }, []);

  // get the height of the map
  const map_y = useRef(null)
  useEffect(() => {
      setMasterHeight(map_y.current.clientHeight)
  }, [masterWidth])

  // set the graphical timer 
  const [graphTime, setGraphTime] = useState(0)
  useEffect(() => {
    const timer = setTimeout(() => {
      // update its positions
      setGraphTime(graphTime + 1)
    }, 100);

    return () => clearTimeout(timer)
  },[graphTime])

  useEffect(() => {
    const colliders = [missileTrajectory, planeTrajectory]
    collision(colliders, setMissileTrajectory, setPlaneTrajectory)
  }, [graphTime])

  return (
    <Context.Provider value={[masterWidth, masterHeight, resolution, setMissileTrajectory, setPlaneTrajectory, graphTime, missileTrajectory, planeTrajectory]}>
      <div className="flex mt-5 relative z-0">
        <div className="flex-auto overflow-hidden w-2/3" ref={map_y}>
          <Plane width="75" exploded={planeTrajectory.exploded} />
          <Missile width="75" exploded={missileTrajectory.exploded}/>
          <img src={africaMap} className="scale-150"/>
        </div>
      </div>
    </Context.Provider>
  )
}

export default App
