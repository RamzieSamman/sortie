import {Trajectory} from './Auxiliary.tsx'

// determines if object 1 is colliding with object 2
function determine_collision(phys_obj_1: Trajectory, phys_obj_2: Trajectory) {
  if (phys_obj_1.x + phys_obj_1.width >= phys_obj_2.x && phys_obj_1.x <= phys_obj_2.x + phys_obj_2.width) {
    if (phys_obj_1.y + phys_obj_1.height >= phys_obj_2.y && phys_obj_1.y <= phys_obj_2.y + phys_obj_2.height) {
      if (phys_obj_1.z != -1 || phys_obj_2.z != -1) {
        return true 
      }
    }
  }
}

export default function collider(physics: Trajectory[], setMissileTrajectory: (a: Trajectory) => void, setPlaneTrajectory: (a: Trajectory) => void) {
  // determine what objects are colliding
  for (let i = 0; i < physics.length; i++) {
    physics.forEach( (firstPhysicObj, k) => {
      if (k != i) {
        if (determine_collision(firstPhysicObj, physics[i])) {
          if (physics[i].type == 'plane') {
            setPlaneTrajectory({...physics[i], exploded: true})
          }
          if (physics[i].type == 'missile') {
            setMissileTrajectory({...physics[i], exploded: true})
          }
        }
      }
    })    
  }
}
