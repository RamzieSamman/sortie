import { useState, useEffect, useRef, useContext } from 'react'
import { Spawn } from './Auxiliary.tsx'
import { Context } from "./App.tsx"
import { motion, AnimatePresence } from "framer-motion"
import explodeImg from './assets/explode_128.png'

interface Kinematics {
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
  useEffect(() => {
    if (graphObj.current) {
      setdimension({...dimension, width: graphObj.current.clientHeight, height: graphObj.current.clientWidth}) 
    }

    setGraphicalPosition({...graphicalPosition, x: spawn.position.x - dimension.width/2, y: spawn.position.y - dimension.height/2})

    // remove the colided spawn
  }, [contextApp.masterWidth, contextApp.masterHeight, spawn.position])

  // update the position due to velocity every 100 ms
  useEffect(() => {
    // update its positions
    setSpawns( (prevSpawns: Spawn[]) => {
        let newSpawns:Spawn[] = [...prevSpawns]
        newSpawns[indexSpawn] = {
            ...spawn,
            position: {x: spawn.velocity.x/10 + spawn.position.x, y: spawn.velocity.y/10 + spawn.position.y, z:0},
            height: dimension.height,
            width: dimension.width
        }
        return newSpawns
    })

    // get the angle towards motion
    setRotate(90 - Math.atan2(spawn.velocity.y, spawn.velocity.x) * 57.2958)
  },[contextApp.graphTime])

  useEffect(() => {
    contextApp.setPlaneTrajectory({...contextApp.planeTrajectory, ...spawn.position, ...dimension})
  }, [spawn.position, dimension])

  if (!spawn.exploded) {
    return (
      <motion.div 
        className="absolute z-10"
        style={{bottom: spawn.position.y, left: spawn.position.x}}
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
         style={{bottom: spawn.position.y, left: spawn.position.x}} 
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

