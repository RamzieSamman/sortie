import { useState, useEffect, useRef } from 'react'
import jetPlane from '../assets/jet-plane.png'
import explode from '../assets/explode_128.png'
import { useContext } from 'react';
import { Context } from "../App.tsx"
import { motion, AnimatePresence } from "framer-motion"

type PlaneProps = {
  width: number,
  exploded: boolean
}

interface Kinematics {
  x: number
  y: number
  z: number
}
interface ObjDimension{
  width: number
  height: number
}

export default function Plane({width, exploded}:PlaneProps) {
  // import variables fromt he App.tsx
  const contextApp = useContext(Context)

  // set position for plane
  const [position, setPosition] = useState<Kinematics>({x: 25, y: 1, z: 10})
  const [graphicalPosition, setGraphicalPosition] = useState<Kinematics>({x: position.x, y: position.y, z: position.z})
  const [velocity, setVelocity] = useState<Kinematics>({x: 5, y: 0, z: 0})
  const [rotate, setRotate] = useState<number>(0)

  const planeObj = useRef<HTMLInputElement>(null)
  const [dimension, setdimension] = useState<ObjDimension>({width: 1, height: 1})

  // adjust plane graphically to accurately represent its position
  useEffect(() => {
    if (planeObj.current) {
      setdimension({...dimension, width: planeObj.current.clientHeight, height: planeObj.current.clientWidth}) 
    }

    setGraphicalPosition({...graphicalPosition, x: position.x - dimension.width/2, y: position.y - dimension.height/2})
  }, [contextApp.masterWidth, contextApp.masterHeight, position])

  // update the position due to velocity every 100 ms
  useEffect(() => {
    // update its positions
    setPosition({...position, x: velocity.x/10 + position.x, y: velocity.y/10 + position.y})

    // get the angle towards motion
    setRotate(90 - Math.atan2(velocity.y, velocity.x) * 57.2958)
  },[contextApp.graphTime])

  useEffect(() => {
    contextApp.setPlaneTrajectory({...contextApp.planeTrajectory, ...position, ...dimension})
  }, [position, dimension])
          //initial={ opacity: 1 } animate={ opacity: 0 } exit={ opacity: 0} transition={ duration: 8 }
          //animate={ rotate }
  if (!exploded) {
    return (
      <motion.div 
        className="absolute z-10"
        style={{bottom: position.y, left: position.x}}
        ref={ planeObj }
        animate={{rotate }}
      >
          <img src={jetPlane} width={4*contextApp.masterWidth/width}/>
      </motion.div>
    )
  } else {
   return (
     <AnimatePresence>
       <motion.div 
         className="absolute z-10"
         style={{bottom: position.y, left: position.x}} 
         ref={planeObj} 
         initial={{ opacity: 1 }}
         animate={{ opacity: 0 }}
         exit={{ opacity: 0}}
         transition={{ duration: 8 }}
        >
          <img src={explode} width={4*contextApp.masterWidth/width}/>
       </motion.div>
     </AnimatePresence>
   )
 }
}
