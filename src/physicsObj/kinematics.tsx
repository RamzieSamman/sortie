import { useContext, useEffect } from 'react'
import { Context } from "../App.tsx"
import { Kinematics } from './PhysicsObj.tsx'
import { Spawn } from '../Auxiliary'

interface Dimension {
    width: number,
    height: number
}
interface Resolution {
    x: number,
    height: number
}

export const velocityManeger = (spawn:Spawn, dimension:Dimension, setSpawns:(a:Spawn[])=>void, indexSpawn:number, setRotate:(a:number)=>void):void => {
    // import variables fromt he App.tsx
    const contextApp = useContext(Context)

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
}

export const graphicalManager = (graphObj:any, dimension:Dimension, setdimension:(a:Dimension)=>void, setGraphicalPosition:(a:Kinematics)=>void, spawn:Spawn, mapWidth:number, mapHeight:number) => {
    // import variables fromt he App.tsx
    const contextApp = useContext(Context)

    // adjust plane graphically to accurately represent its position
    useEffect(() => {
        // adjust size of asset depending on its size in the dom
        if (graphObj.current) {
            setdimension( (prevDimension) => {
                return {...prevDimension, width: graphObj.current.clientHeight, height: graphObj.current.clientWidth}
            } )
        }

        // adjust the <x,y,z> position as the center of the object. (only for grpahical representation)
        setGraphicalPosition((prevGraphicalPosition) => {
            //console.log((spawn.position.x - dimension.width/2)/mapWidth)
            //console.log(spawn.position.x)
            //console.log(dimension.width/2)
            //console.log(mapWidth)

            return{...prevGraphicalPosition, x: spawn.position.x - 100*(dimension.width/2)/mapWidth, y: spawn.position.y - 100*(dimension.height/2)/mapHeight}
            //return{...prevGraphicalPosition, x: spawn.position.x , y: spawn.position.y }
        })

        // remove the colided spawn
    }, [contextApp.masterWidth, contextApp.masterHeight, spawn.position])

}
