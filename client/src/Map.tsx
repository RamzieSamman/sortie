import React, { useState, useRef } from 'react'
import africaMap from './assets/map_africa.png'
import { collisionHandler } from './collider.tsx'
import { graphTimer, mapHandler, Spawn, SpawnAsset, spawnHandler} from './Auxiliary.tsx'
import PhysicsObj from './physicsObj/PhysicsObj.tsx'
import { launchMissile } from './physicsObj/Interaction.tsx'

interface ContextProvider {
  masterWidth: number,
  masterHeight: number,
  graphTime: number,
  begin: boolean,
  spawns: Spawn[],
  setSpawns: (a:any)=>void
}


export const Context = React.createContext<ContextProvider>()

export function Map() { // 480p resolution
  const resolution: {x: number, y:number} = {x: 640, y: 480}

  // trajectories with z = -1, ensures it does not collide on init
  const [spawns, setSpawns] = useState<SpawnAsset[]>([])
  const [updateSpawns, setUpdateSpawns] = useState<number>(0)
  const [begin, setBegin] = useState<boolean>(false)

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
        <div className="flex relative z-0">
            <div className="flex-auto overflow-hidden w-2/3 cursor-cell" ref={map_y}>
                {spawns.map( (spawn, index) => (
                <PhysicsObj
                    key={index}
                    width={75}
                    spawn={spawn}
                    indexSpawn={index}
                />
                ))}
                <img src={africaMap} className="scale-150"/>
            </div>
        </div>
        <button className="bg-indigo-500 m-4 p-4" onClick={toggleBegin}>begin</button>
    </Context.Provider>
  )
}