import {Spawn} from './Auxiliary.tsx'
import { useEffect } from 'react'

// determines if object 1 is colliding with object 2
function determine_collision(phys_obj_1: Spawn, phys_obj_2: Spawn):boolean {
  if (phys_obj_1.position.x + phys_obj_1.width >= phys_obj_2.position.x && phys_obj_1.position.x <= phys_obj_2.position.x + phys_obj_2.width) {
    if (phys_obj_1.position.y + phys_obj_1.height >= phys_obj_2.position.y && phys_obj_1.position.y <= phys_obj_2.position.y + phys_obj_2.height) {
      if (phys_obj_1.position.z != -1 || phys_obj_2.position.z != -1) {
        return true 
      }
    }
  }
  return false
}

export function collision(physicObjs: Spawn[], setPhysicObjs: (a:Spawn[]) => void):number[] {
  let collisionOccured:number[] = []

  // determine what objects are colliding
  physicObjs.forEach( (firstPhysicObj:Spawn, i) => {
    physicObjs.forEach( (secondPhysicObj:Spawn, k) => {
      if (k != i) {
        if (determine_collision(firstPhysicObj, secondPhysicObj)) {
          setPhysicObjs( (oldPhysicObjs:Spawn[]) => {
            let newPhysicObjs:Spawn[] = [...oldPhysicObjs]
            newPhysicObjs[k] = {...firstPhysicObj, exploded: true}
            return newPhysicObjs
          })
          collisionOccured.push(k)
        }
      }
    })    
  })
  return collisionOccured
}

export const collisionHandler = (spawns:Spawn[], setSpawns:(a:Spawn[]) => void, graphTime:number):void => {
  // determine if collision occured and update states
  useEffect(() => {
    // determine if a collision occured and update the spawn to render an explosion
    let collisionOccured:number[] = collision(spawns, setSpawns)

    // if collision occured remove the object after a short delay
    if (collisionOccured.length >= 1) {
      collisionOccured.forEach( (index) => {
        // if it has exploded, wait a while until removing the object
        setTimeout(() => {
          // remove the object now
          setSpawns(spawns.slice(index, index))
        }, 8000)
      })
    }
  }, [graphTime])
}