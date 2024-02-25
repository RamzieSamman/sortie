import { useState, useEffect, useRef } from 'react'
import jetPlane from './assets/jet-plane.png'
import explode from './assets/explode_128.png'
import { useContext } from 'react';
import { Context } from "./App.tsx"
import { motion, AnimatePresence } from "framer-motion"

export default function Plane( { width, exploded} ) {
  const [masterWidth, masterHeight, resolution, setMissileTrajectory, setPlaneTrajectory, graphTime, missileTrajectory, planeTrajectory] = useContext(Context);

  const [position, setPosition] = useState({x: 25, y: 1, z: 10})
  const [graphicalPosition, setGraphicalPosition] = useState({x: position.x, y: position.y, z: position.z})
  const [velocity, setVelocity] = useState({x: 5, y: 0, z: 0})
  const [rotate, setRotate] = useState(0)

  const planeObj = useRef(null)
  const [dimension, setdimension] = useState({width: 1, height: 1})

  // adjust plane graphically to accurately represent its position
  useEffect(() => {
    setdimension({...dimension, width: planeObj.current.clientHeight, height: planeObj.current.clientWidth}) 

    setGraphicalPosition({...graphicalPosition, x: position.x - dimension.width/2, y: position.y - dimension.height/2})
  }, [masterWidth, masterHeight, position])

  // update the position due to velocity every 100 ms
  useEffect(() => {
    // update its positions
    setPosition({...position, x: velocity.x/10 + position.x, y: velocity.y/10 + position.y})

    // get the angle towards motion
    setRotate(90 - Math.atan2(velocity.y, velocity.x) * 57.2958)
  },[graphTime])

  useEffect(() => {
    setPlaneTrajectory({...planeTrajectory, ...position, ...dimension})
  }, [position, dimension])

  if (! exploded) {
    return (
      <>
        <motion.div 
          className="absolute z-10"
          style={{bottom: position.y, left: position.x}} 
          ref={planeObj} 
          animate={{ rotate }}>
            <img src={jetPlane} width={4*masterWidth/width}/>
        </motion.div>
      </>
    )
  }
  
  if (exploded) {
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
            <img src={explode} width={4*masterWidth/width}/>
        </motion.div>
      </AnimatePresence>
    )
  }
}
