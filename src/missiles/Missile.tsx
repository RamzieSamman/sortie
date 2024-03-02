import { useState, useEffect, useRef } from 'react'
import missile from '../assets/missile.png'
import explode from '../assets/explode_128.png'
import { useContext } from 'react';
import { Context } from "../App.tsx"
import { motion, AnimatePresence } from "framer-motion"

type MissileProps = {
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
export default function Missile( { width, exploded}:MissileProps ) {
  const contextApp = useContext(Context)

  const [position, setPosition] = useState<Kinematics>({x: 100, y: 1, z: 10})
  const [graphicalPosition, setGraphicalPosition] = useState<Kinematics>({x: position.x, y: position.y, z: position.z})
  const [velocity, setVelocity] = useState<Kinematics>({x: -5, y: 0, z: 0})
  const [rotate, setRotate] = useState<number>(0)

  const missileObj = useRef<HTMLInputElement>(null)
  const [dimension, setDimension] = useState({width: 1, height: 1})

  // adjust plane graphically to accurately represent its position
  useEffect(() => {
    if (missileObj.current) {
      setDimension({width: missileObj.current.clientHeight, height: missileObj.current.clientWidth}) 
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
    contextApp.setMissileTrajectory({...contextApp.missileTrajectory, ...position, ...dimension})
  }, [position, dimension])

  if (!exploded) {
    return (
      <>
        <motion.div 
          className="absolute z-10"
          style={{bottom: position.y, left: position.x}} 
          ref={missileObj} 
          animate={{ rotate }}>
            <img src={missile} width={4*contextApp.masterWidth/width}/>
        </motion.div>
      </>
    )
  } else {
    return (
      <AnimatePresence>
        <motion.div 
          className="absolute z-10"
          style={{bottom: position.y, left: position.x}} 
          ref={missileObj} 
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0}}
          transition={{ duration: 1 }}
          >
            <img src={explode} width={4*contextApp.masterWidth/width}/>
        </motion.div>
      </AnimatePresence>
    )
  }
}
