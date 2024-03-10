import React, { useState, useEffect, useMemo } from 'react'
import jetPlane from './assets/jet-plane.png'
import missile from './assets/missile.png'
import { Kinematics } from './physicsObj/PhysicsObj'

export class SpawnAsset {
  exploded:boolean
  asset:string
  position:Kinematics
  velocity:Kinematics
  width:number
  height:number
  angle: number

  constructor(exploded:boolean, asset:string, position:Kinematics, velocity:Kinematics, width:number, height:number) {
    this.exploded = exploded 
    this.asset = asset
    this.position = position 
    this.velocity = velocity 
    this.width = width
    this.height = height
  }

  getSpawnArray() {
    const spawnArray:Spawn = {
      exploded: this.exploded,
      asset: this.asset,
      position: this.position,
      velocity: this.velocity,
      width: this.width,
      height: this.height
    }
    return spawnArray
  }

  setSpawnArray({exploded, asset, position, velocity, width, height}:Spawn):void {
    this.exploded = exploded 
    this.asset = asset
    this.position = position 
    this.velocity = velocity 
    this.width = width
    this.height = height
  }

  get2DAngleDegrees():number {

    let angleOffset = 0
    // adjust the angle of velocity to the angle on a unit curve
    if (this.velocity.x < 0 && this.velocity.y >= 0) {
        angleOffset = 180
    } else if (this.velocity.x < 0 && this.velocity.y < 0){
        angleOffset = - 180
    } else{
        angleOffset = 0
    }

    //console.log('the degree is = ' + (-Math.atan(this.velocity.y/this.velocity.x) * 180/Math.PI + angleOffset))
    return Math.atan(this.velocity.y/this.velocity.x) * 180/Math.PI + angleOffset
  }

  set2DVelocityFromAngle(angle:number):void {
    const velocityMagnitude = this.get2DVelocityMagnitude()

    this.velocity = {
      x: velocityMagnitude * Math.cos(angle * Math.PI/180),
      y: velocityMagnitude * Math.sin(angle * Math.PI/180),
      z: this.velocity.z
    }
  }

  get2DVelocityMagnitude():number {
      return Math.abs(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2))
  }

  // be careful calling this function, as you need to ensure you didn't
  // unintentionally increase velocity
//  set2DVelocity(velocity_x:number, velocity_y:number, velocity_z?:number):void {
//    // set the new x an y velocity
//    this.velocity.x = velocity_x
//    this.velocity.y = velocity_y
//
//    // if provided z, update z as well
//    if (velocity_z) {
//      this.velocity.z = velocity_z
//    }
//  }
}

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
  exploded:boolean
  asset:string
  position:Kinematics
  velocity:Kinematics
  width:number
  height:number
}

export const spawnHandler = (spawns:any, setSpawns:any, updateSpawns: number):void => {
  useEffect( () => {
    // create two physics objects
    setSpawns([
        ...spawns,
        new SpawnAsset(false, jetPlane, {x: 70, y: 50, z: 10}, {x: 1, y: 0, z: 0}, 0, 0),
        new SpawnAsset(false, missile, {x: 50, y: 50, z: 10}, {x: 1, y: 0, z: 0}, 0, 0),
        new SpawnAsset(false, missile, {x: 30, y: 30, z: 10}, {x: 1, y: 0, z: 0}, 0, 0),
        new SpawnAsset(false, missile, {x: 30, y: 50, z: 10}, {x: 1, y: 0, z: 0}, 0, 0),
        new SpawnAsset(false, missile, {x: 50, y: 30, z: 10}, {x: 1, y: 0, z: 0}, 0, 0)
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
