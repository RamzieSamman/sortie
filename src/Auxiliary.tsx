import React, { useState, useEffect, useRef } from 'react'
import jetPlane from './assets/jet-plane.png'
import missile from './assets/missile.png'

export type Trajectory = {
  x: number,
  y: number,
  z: number,
  width: number,
  height: number,
  exploded: boolean,
  type: string
}

export const graphStep = 100

export interface Spawn {
  asset: string,
  position: {x:number, y:number, z:number},
  velocity: {x:number, y:number, z:number},
  exploded: boolean,
  width: number,
  height: number
}

export interface ContextProvider {
  masterWidth: number,
  masterHeight: number,
  graphTime: number,
}

export const spawnHandler = (spawns:Spawn[], setSpawns:(a:Spawn[]) => void, updateSpawns: number):void => {
  useEffect( () => {
    // create two physics objects
    setSpawns([
        ...spawns,
        {exploded: false, asset: jetPlane, position: {x: 70, y: 50, z: 10}, velocity: {x: -1, y: 0, z: 0}, width: 0, height: 0},
        {exploded: false, asset: missile, position: {x: 50, y: 50, z: 10}, velocity:{x: 1, y: 0, z: 0}, width: 0, height: 0}
      ]
    )
  }, [updateSpawns])
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
    }, graphStep);

    // clean up
    return () => clearTimeout(timer)
  },[graphTime])

  return graphTime
}
