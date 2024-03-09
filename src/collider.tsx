import {Spawn} from './Auxiliary.tsx'
import { useState, useEffect, useMemo } from 'react'

// determines if object 1 is colliding with object 2
function determine_collision(phys_obj_1: Spawn, phys_obj_2: Spawn, masterWidth:number, masterHeight:number):boolean {
  if (phys_obj_1.position.x + 100*phys_obj_1.width/masterWidth >= phys_obj_2.position.x && phys_obj_1.position.x <= phys_obj_2.position.x + 100*phys_obj_2.width/masterWidth) {
    if (phys_obj_1.position.y + 100*phys_obj_1.height/masterHeight >= phys_obj_2.position.y && phys_obj_1.position.y <= phys_obj_2.position.y + 100*phys_obj_2.height/masterHeight) {
      if (phys_obj_1.position.z != -1 || phys_obj_2.position.z != -1) {
        return true 
      }
    }
  }
  return false
}

export function collision(physicObjs: Spawn[], setPhysicObjs: (a:Spawn[]) => void, masterWidth:number, masterHeight:number):void {

  // determine what objects are colliding
  physicObjs.forEach( (firstPhysicObj:Spawn, i) => {
    physicObjs.forEach( (secondPhysicObj:Spawn, k) => {
      if (k != i && (firstPhysicObj.exploded === false || secondPhysicObj.exploded === false)) {
        if (determine_collision(firstPhysicObj, secondPhysicObj, masterWidth, masterHeight)) {
          setPhysicObjs( (oldPhysicObjs:Spawn[]) => {
            let newPhysicObjs:Spawn[] = oldPhysicObjs
            newPhysicObjs[k] = {...firstPhysicObj, exploded: true}
            return newPhysicObjs
          })
        }
      }
    })    
  })
}

export const collisionHandler = (begin:boolean, spawns:Spawn[], setSpawns:(a:Spawn[]) => void, graphTime:number, masterWidth:number, masterHeight:number):void => {
  useEffect(() => {
    if(begin) {
      collision(spawns, setSpawns, masterWidth, masterHeight)
    }
  }, [graphTime])
}