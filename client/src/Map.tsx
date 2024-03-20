import React, { useState, useRef, useEffect } from 'react'
import africaMap from './assets/map_africa.png'
import { collisionHandler } from './collider.tsx'
import { graphTimer, mapHandler, Spawn, SpawnAsset, spawnHandler} from './Auxiliary.tsx'
import PhysicsObj from './physicsObj/PhysicsObj.tsx'
import { launchMissile } from './physicsObj/Interaction.tsx'
import throttle from 'lodash.throttle'
import { dragToScroll } from './mapInteractions/MapInteraction.tsx'

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

  const dragToSelect = (e) => {
    // remove previous selection box if it exist
    document.getElementById('selection-box')?.remove()
    document.getElementById('qausi-box')?.remove()

    // get the starting click poisition
    let startX = e.pageX
    let startY = e.pageY
    let drag = true

    // create the selection div
    let box = document.createElement("div")
    box.setAttribute('id', 'selection-box')


    let qausiBox = document.createElement("div")
    qausiBox.setAttribute('id', 'qausi-box')
    qausiBox.style.cssText = "z-index: 20; top: 0px; left: 0px; position: absolute; width: 100%; height: 100%;"
    map_y.current?.appendChild(qausiBox)

    const startDrag = (e) => {
        if (!drag) return
        // prevent selection of text or objects
        e.preventDefault()

        // get the transversal position
        const x = e.pageX
        const y = e.pageY
        console.log(x)
        const walkX = x - startX
        const walkY = y - startY
        const negativeWalkX = -walkX
        const negativeWalkY = -walkY 

        // if walkX is positive, else spawn the div differently
        if (walkX >= 0 && walkY >= 0) {
          box.style.cssText = "z-index: 20; top: "+startY+"px; left: "+startX+"px; position: absolute; width: "+walkX+"px; height: "+walkY+"px; border-style: dotted; border-width: 2px; border-color: rgb(0 0 0)"
        } else if (walkX < 0 && walkY > 0) {
          box.style.cssText = "z-index: 20; top: "+startY+"px; left: "+x+"px; position: absolute; width: "+negativeWalkX+"px; height: "+walkY+"px; border-style: dotted; border-width: 2px; border-color: rgb(0 0 0)"
        } else if (walkX >= 0 && walkY < 0) {
          box.style.cssText = "z-index: 20; top: "+y+"px; left: "+startX+"px; position: absolute; width: "+walkX+"px; height: "+negativeWalkY+"px; border-style: dotted; border-width: 2px; border-color: rgb(0 0 0)"
        } else if (walkX < 0 && walkY < 0) {
          box.style.cssText = "z-index: 20; top: "+y+"px; left: "+x+"px; position: absolute; width: "+negativeWalkX+"px; height: "+negativeWalkY+"px; border-style: dotted; border-width: 2px; border-color: rgb(0 0 0)"
        }

        // add the selection div to the map
        map_y.current?.appendChild(box)
    }
    map_y.current?.addEventListener('mousemove', startDrag)

    map_y.current?.addEventListener('mouseup', (e) => {
        drag = false
    })

    //map_y.current?.addEventListener('mouseleave', (e) => {
    //    drag = false
    //})

  }

  // spawn rockets
  launchMissile(setSpawns, spawns[0], masterWidth, masterHeight) 

  return (
    <Context.Provider value={{masterWidth, masterHeight, graphTime, begin, spawns, setSpawns}}>
        <div className="relative z-0 cursor-grab">
          <div
            style={{
                backgroundSize: '10px 10px', backgroundImage: 'linear-gradient(to right, #d9d9d9 1px, transparent 1px), linear-gradient(to bottom, #d9d9d9 1px, transparent 1px)',
                width: '15000px', height: '15000px'
              }}
            ref={map_y}
            onMouseDown={(e) => dragToSelect(e)}
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
        </div>
        <button className="bg-indigo-500 m-4 p-4" onClick={toggleBegin}>begin</button>
    </Context.Provider>
  )
}