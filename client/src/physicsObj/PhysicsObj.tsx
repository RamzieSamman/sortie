import { useState, useEffect, useRef, useContext, SyntheticEvent, createContext } from 'react'
import { Spawn, SpawnAsset, graphStep } from '../Auxiliary.tsx'
import { placementManeger } from './GraphEditor.tsx'
import { Context } from "../Map.tsx"
import { velocityManeger, graphicalManager } from './kinematics.tsx'
import { motion, AnimatePresence } from "framer-motion"
import { displayKinematics, launchMissile } from './Interaction.tsx'
import explodeImg from '../assets/explode_128.png'

export interface Kinematics {
  x: number
  y: number
  z: number
}

type PhysicProps = {
  width: number,
  spawn: SpawnAsset,
  indexSpawn: number,
}

type PhysicObjType = {
  width: number
  spawn: SpawnAsset
  indexSpawn: number
  graphicalPosition: Kinematics
}

export const physicObjContext = createContext<PhysicObjType>()

export default function PhysicsObj({width, spawn, indexSpawn}:PhysicProps) {
  // import variables fromt he App.tsx
  const contextApp = useContext(Context)

  // set position for plane
  const [graphicalPosition, setGraphicalPosition] = useState<Kinematics>({x: spawn.position.x, y: spawn.position.y, z: spawn.position.z})
  const [rotate, setRotate] = useState<number>(0)
  const graphObj = useRef<HTMLInputElement>(null)
  const [toggleDetail, setToggleDetail] = useState<boolean>(false)

  // adjust plane graphically to accurately represent its position
  graphicalManager(graphObj, contextApp.setSpawns, indexSpawn, setGraphicalPosition, spawn, contextApp.masterWidth, contextApp.masterHeight)

  // update the position due to velocity
  velocityManeger(contextApp.begin, spawn, contextApp.setSpawns, indexSpawn, setRotate)

  // display kinematics for physics property on click
  displayKinematics(contextApp.begin, graphObj, setToggleDetail)

  // upon selection of the asset, allow the user to rotate it with the scroll wheel
  placementManeger(!contextApp.begin, graphObj, toggleDetail, setToggleDetail, setRotate, rotate, indexSpawn, contextApp.setSpawns, contextApp.spawns)

  return (
    <physicObjContext.Provider value={{ width, spawn, indexSpawn, graphicalPosition }}>
      {spawn.exploded
        ?
          <Explosion graphicalPosition={graphicalPosition} width={width} delay={8000} />
        :
          <AssetFunctional toggleDetail={toggleDetail} graphObj={graphObj} rotate={rotate} />
      }
    </physicObjContext.Provider>
  )
}

type IntactAsset = {
  toggleDetail: boolean,
  graphObj: any,
  rotate: number
}

// non-exploded physics object
function AssetFunctional({ toggleDetail, graphObj, rotate }:IntactAsset){

  // import variables from App.tsx
  const contextApp = useContext(Context)

  // import physic object variables
  const PhysicObjContext = useContext(physicObjContext)

  return (
    <div
      className={"absolute z-10 flex flex-row"}
      style={{bottom: PhysicObjContext.graphicalPosition.y + '%', left: PhysicObjContext.graphicalPosition.x + '%'}}>
      <div className={"p-2 border-2 border-solid " + (toggleDetail ? ("border-zinc-600"):("border-transparent"))}>
        <div ref={ graphObj } style={{transform: 'rotateZ(' + rotate*(-1) + 'deg)'}} id={PhysicObjContext.indexSpawn + '-asset'} >
            <img src={PhysicObjContext.spawn.asset} width={4*contextApp.masterWidth/PhysicObjContext.width}/>
        </div>
      </div>
    
      <div className='text-xs ml-1'>
        {toggleDetail ? (
          'v = ' + Math.sqrt(Math.pow(PhysicObjContext.spawn.velocity.x, 2) + Math.pow(PhysicObjContext.spawn.velocity.y, 2) + Math.pow(PhysicObjContext.spawn.velocity.z, 2)) + ' m/s') : ('')}
        <br/>
        {toggleDetail ? ('x = ' + PhysicObjContext.spawn.position.x.toFixed() + ' m') : ('')}
        <br/>
        {toggleDetail ? ('y = ' + PhysicObjContext.spawn.position.y.toFixed() + ' m') : ('')}
        <br/>
        {toggleDetail ? ('z = ' + PhysicObjContext.spawn.position.z.toFixed() + ' m') : ('')}
      </div>
    </div>
  )
}

type explosionProp = {
  graphicalPosition: Kinematics
  width: number
  delay: number
}

// exploded physics object
function Explosion({ graphicalPosition, width, delay }:explosionProp){
  // import variables fromt he App.tsx
  const contextApp = useContext(Context)
  const [disappear, setDisappear] = useState<boolean>(false)

  const graphObj = useRef<HTMLInputElement>(null)
  const disapearid = setTimeout( () => {
    setDisappear(true)
    clearTimeout(disapearid)
  }, delay)

  return (
    (!disappear
      ?
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
      :
      <></>
      )
  )
}