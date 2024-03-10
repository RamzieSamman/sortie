import { useContext, useEffect } from 'react'
import { Context } from "../App.tsx"
import { Kinematics } from './PhysicsObj.tsx'
import { Spawn, SpawnAsset } from '../Auxiliary'

interface Dimension {
    width: number,
    height: number
}
interface Resolution {
    x: number,
    height: number
}

export const velocityManeger = (begin:boolean, spawn:SpawnAsset, dimension:Dimension, setSpawns:(a:SpawnAsset[])=>void, indexSpawn:number, setRotate:(a:number)=>void):void => {
    // import variables fromt he App.tsx
    const contextApp = useContext(Context)

    useEffect(() => {
        if (begin) {
            // update its positions
            setSpawns( (prevSpawns: SpawnAsset[]) => {
                let newSpawns = prevSpawns
                let spawn = newSpawns[indexSpawn]

                // mutate position and update array
                spawn.setSpawnArray({
                    ...spawn.getSpawnArray(),
                    position: {x: spawn.velocity.x/10 + spawn.position.x, y: spawn.velocity.y/10 + spawn.position.y, z:0},
                    height: dimension.height,
                    width: dimension.width
                })
                newSpawns[indexSpawn] = spawn

                return newSpawns
            })

            // get the angle towards motion
            setRotate(-Math.atan2(spawn.velocity.y, spawn.velocity.x) * 180/Math.PI)
        }

    },[contextApp.graphTime])
}

export const graphicalManager = (graphObj:any, dimension:Dimension, setdimension:(a:Dimension)=>void, setGraphicalPosition:(a:Kinematics)=>void, spawn:SpawnAsset, mapWidth:number, mapHeight:number):void => {
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
            return{...prevGraphicalPosition, x: spawn.position.x - 100*(dimension.width/2)/mapWidth, y: spawn.position.y - 100*(dimension.height/2)/mapHeight}
        })
    }, [contextApp.masterWidth, contextApp.masterHeight, contextApp.graphTime])

}
