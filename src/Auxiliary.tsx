import React, { useState, useEffect, useRef } from 'react'

export type Trajectory = {
  x: number,
  y: number,
  z: number,
  width: number,
  height: number,
  exploded: boolean,
  type: string
}

export const mapHandler = (map_y:any):number[] => {
  const [masterWidth, setMasterWidth] = useState<number>(window.innerWidth)
  const [masterHeight, setMasterHeight] = useState<number>(0)

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
  useEffect(() => {
      setMasterHeight(map_y.current.clientHeight)
  }, [masterWidth])

  return [masterWidth, masterHeight]
}

// set the graphical timer 
export const graphTimer = ():number => {
  const [graphTime, setGraphTime] = useState<number>(0)

  // update the graphical timer by the specified amount of time
  useEffect(() => {
    const timer = setTimeout(() => {
      // increment graphTimer
      setGraphTime(graphTime + 1)
    }, 100);

    // clean up
    return () => clearTimeout(timer)
  },[graphTime])

  return graphTime
}
