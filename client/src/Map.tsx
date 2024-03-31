import React, { useState, useRef, useEffect } from 'react'
import { collisionHandler } from './collider.tsx'
import { graphTimer, mapHandler, Spawn, SpawnAsset, spawnHandler} from './Auxiliary.tsx'
import PhysicsObj from './physicsObj/PhysicsObj.tsx'
import { launchMissile } from './physicsObj/Interaction.tsx'
import { ObjectPlacement, outerToolAction, toolAction } from './mapInteractions/MapInteraction.tsx'
import cursorPointer from './assets/cursor-pointer.svg'
import cursorGrab from './assets/cursor-grab.svg'
import andGate from './assets/and_gate.svg'
import nandGate from './assets/nand_gate.svg'
import { PlaceTexts } from './text/PlacementTexts.tsx'
import { BoolElement } from './mapInteractions/MapInteraction.tsx'

interface ContextProvider {
  masterWidth: number,
  masterHeight: number,
  graphTime: number,
  begin: boolean,
  spawns: Spawn[],
  setSpawns: (a:any)=>void
}

export type TextBox = {
  x: number
  y: number
  text: string
  width: number
  height: number
}

const ToolBars = ["default", "grab", "cell", "move", "text", 'andGate'] as const
export type ToolBar = typeof ToolBars[number]

const BoolObjectTypeDef = ["AndGate", "NandGate", "OrGate", "NorGate"] as const
export type BoolObjectType = typeof BoolObjectTypeDef[number]

export type BoolObject = {x: number, y: number, object: BoolObjectType}

export const Context = React.createContext<ContextProvider>()

export function Map() { // 480p resolution
  const resolution: {x: number, y:number} = {x: 640, y: 480}

  // trajectories with z = -1, ensures it does not collide on init
  const [spawns, setSpawns] = useState<SpawnAsset[]>([])
  const [updateSpawns, setUpdateSpawns] = useState<number>(0)
  const [begin, setBegin] = useState<boolean>(false)
  const [toolBar, setToolBar] = useState<ToolBar>("default")
  const [textBox, setTextBox] = useState<TextBox[]>([{x: 0, y: 0, text: '', width: 0, height: 0}])
  const [boolObjects, setBoolObjects] = useState<BoolObject[]>([])

  // set the graphic/mechanical timer
  const graphTime:number = graphTimer()

  // sets the map specification, and adjust for dynamic situations
  const map_y = useRef<HTMLInputElement>(null)
  const [masterWidth, masterHeight] = mapHandler(map_y)

  // handle spans creation, destruction and properties
  spawnHandler(spawns, setSpawns, updateSpawns)

  // determine if collision occured and update states
  collisionHandler(begin, spawns, setSpawns, graphTime, masterWidth, masterHeight)

  // upon clicking the button, toggle pause or play
  const toggleBegin = () => {
    setBegin( (begin) => !begin)
  }

  // spawn rockets
  launchMissile(setSpawns, spawns[0], masterWidth, masterHeight) 

  return (
    <Context.Provider value={{masterWidth, masterHeight, graphTime, begin, spawns, setSpawns}}>
        <div className="relative z-0 font-['Virgil']" style={{cursor: toolBar}}
        onMouseDown={(e) => outerToolAction(e, map_y, toolBar, setToolBar, textBox, setTextBox)}
        >
          <div 
            style={{
                backgroundSize: '10px 10px', backgroundImage: 'linear-gradient(to right, #d9d9d9 1px, transparent 2px), linear-gradient(to bottom, #d9d9d9 1px, transparent 1px)',
                width: '15000px', height: '15000px'
              }}
            ref={map_y}
          onMouseDown={(e) => toolAction(e, map_y, toolBar, setToolBar, textBox, setTextBox, boolObjects, setBoolObjects)}
          >
          </div>
              {spawns.map( (spawn, index) => (
              <PhysicsObj
                  key={index}
                  width={75}
                  spawn={spawn}
                  indexSpawn={index}
              />
              ))}

              <PlaceTexts theTexts={textBox} toolBar={toolBar} setToolBar={setToolBar} setTheTexts={setTextBox}/>

              {toolBar === 'andGate' && <ObjectPlacement/>}
              {boolObjects.map( (boolObject, index) => (
                <BoolElement boolObject={boolObject} key={index} />
              ))}


            <div className="fixed z-10 select-none bg-white border-2 border-slate-300 rounded-md mt-3 flex flex-col" style={{left: '20px', top: '0px'}}>
                <div className='py-2 px-1 m-1 rounded-sm cursor-pointer hover:bg-orange-100' onClick={()=> setToolBar('default')}> <img src={cursorPointer} width="25px" /> </div>
                <div className='py-2 px-1 m-1 rounded-sm cursor-pointer hover:bg-orange-100' onClick={() => setToolBar('grab')}> <img src={cursorGrab} width="25px" /> </div>
                <div className='border border-b-1 m-2'></div>
                <div className='py-2 px-1 m-1 rounded-sm cursor-pointer hover:bg-orange-100' onClick={() => setToolBar('cell')}> <span className='font-bold justify-center'>tx</span> </div>
                <div className='py-2 px-1 m-1 rounded-sm cursor-pointer hover:bg-orange-100' onClick={() => setToolBar('andGate')}> <img src={andGate} width="25px" /> </div>
            </div>
        </div>
        <button className="bg-indigo-500 m-4 p-4" onClick={toggleBegin}>begin</button>
    </Context.Provider>
  )
}
