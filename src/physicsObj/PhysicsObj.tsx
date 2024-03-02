import { useState, useEffect, useRef, useContext } from 'react'
import { Spawn, graphStep } from '../Auxiliary.tsx'
import { Context } from "../App.tsx"
import { velocityManeger, graphicalManager } from './kinematics.tsx'
import { motion, AnimatePresence } from "framer-motion"
import explodeImg from '../assets/explode_128.png'

export interface Kinematics {
  x: number
  y: number
  z: number
}

type PhysicProps = {
  width: number,
  spawn: Spawn,
  setSpawns: (a:any) => void,
  indexSpawn: number
}

export default function PhysicsObj({width, spawn, setSpawns, indexSpawn}:PhysicProps) {
  // import variables fromt he App.tsx
  const contextApp = useContext(Context)

  // set position for plane
  const [graphicalPosition, setGraphicalPosition] = useState<Kinematics>({x: spawn.position.x, y: spawn.position.y, z: spawn.position.z})
  const [rotate, setRotate] = useState<number>(0)

  const graphObj = useRef<HTMLInputElement>(null)
  const [dimension, setdimension] = useState<{width: number, height: number}>({width: 1, height: 1})

  // adjust plane graphically to accurately represent its position
  graphicalManager(graphObj, dimension, setdimension, setGraphicalPosition, spawn)

  // update the position due to velocity
  velocityManeger(spawn, dimension, setSpawns, indexSpawn, setRotate)

  if (!spawn.exploded) {
    return (
      <motion.div 
        className="absolute z-10"
        style={{bottom: graphicalPosition.y, left: graphicalPosition.x}}
        ref={ graphObj }
        animate={{ rotate }}
      >
          <img src={spawn.asset} width={4*contextApp.masterWidth/width}/>
      </motion.div>
    )
  } else {
   return (
     <AnimatePresence>
       <motion.div 
         className="absolute z-10"
         style={{bottom: graphicalPosition.y, left: graphicalPosition.x}} 
         ref={graphObj} 
         initial={{ opacity: 1 }}
         animate={{ opacity: 0 }}
         exit={{ opacity: 0}}
         transition={{ duration: 8 }}
        >
          <img src={explodeImg} width={4*contextApp.masterWidth/width}/>
       </motion.div>
     </AnimatePresence>
   )
 }
}
