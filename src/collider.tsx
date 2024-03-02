import {Spawn} from './Auxiliary.tsx'

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

export default function collider(physicObjs: Spawn[], setPhysicObjs: (a:Spawn[]) => void) {
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
        }
      }
    })    
  })
}
