import { useState, useEffect, useRef, useContext, SyntheticEvent } from 'react'
import { Spawn, graphStep } from '../Auxiliary.tsx'
import { placementManeger } from './GraphEditor.tsx'
import { Context } from "../App.tsx"
import { velocityManeger, graphicalManager } from './kinematics.tsx'
import { motion, AnimatePresence } from "framer-motion"
import { displayKinematics } from './Interaction.tsx'
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
  indexSpawn: number,
  mapWidth: number,
  mapHeight: number,
  begin: boolean
}

export default function PhysicsObj({width, spawn, setSpawns, indexSpawn, mapWidth, mapHeight, begin}:PhysicProps) {
  // import variables fromt he App.tsx
  const contextApp = useContext(Context)

  // set position for plane
  const [graphicalPosition, setGraphicalPosition] = useState<Kinematics>({x: spawn.position.x, y: spawn.position.y, z: spawn.position.z})
  const [rotate, setRotate] = useState<number>(0)

  const graphObj = useRef<HTMLInputElement>(null)
  const [dimension, setdimension] = useState<{width: number, height: number}>({width: 1, height: 1})
  const [toggleDetail, setToggleDetail] = useState<boolean>(false)

  // adjust plane graphically to accurately represent its position
  graphicalManager(graphObj, dimension, setdimension, setGraphicalPosition, spawn, mapWidth, mapHeight)
  // update the position due to velocity
  velocityManeger(begin, spawn, dimension, setSpawns, indexSpawn, setRotate)
  // display kinematics for physics property on click
  displayKinematics(begin, graphObj, setToggleDetail)
  // upon selection of the asset, allow the user to rotate it with the scroll wheel
  placementManeger(!begin, graphObj, toggleDetail, setToggleDetail, setRotate, rotate, indexSpawn, setSpawns, contextApp.spawns)

  if (!spawn.exploded) {
    return (
      <div
        className={"absolute z-10 flex flex-row"}
        style={{bottom: graphicalPosition.y + '%', left: graphicalPosition.x + '%'}}
      >
        <div className={"p-2 border-2 border-solid " + (toggleDetail ? ("border-zinc-600"):("border-transparent"))}>
          <div ref={ graphObj } style={{transform: 'rotate(' + rotate + 'deg)'}} id={indexSpawn + '-asset'} >
              <img src={spawn.asset} width={4*contextApp.masterWidth/width}/>
          </div>
        </div>
      
        <div className='text-xs ml-1'>
          {toggleDetail ? (
            'v = ' + Math.sqrt(Math.pow(spawn.velocity.x, 2) + Math.pow(spawn.velocity.y, 2) + Math.pow(spawn.velocity.z, 2)) + ' m/s') : ('')}
          <br/>
          {toggleDetail ? ('x = ' + spawn.position.x.toFixed() + ' m') : ('')}
          <br/>
          {toggleDetail ? ('y = ' + spawn.position.y.toFixed() + ' m') : ('')}
          <br/>
          {toggleDetail ? ('z = ' + spawn.position.z.toFixed() + ' m') : ('')}
        </div>
      </div>
    )
  } else {
   return (
     <AnimatePresence>
       <motion.div 
         className="absolute z-10"
         style={{bottom: graphicalPosition.y + '%', left: graphicalPosition.x + '%'}} 
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
