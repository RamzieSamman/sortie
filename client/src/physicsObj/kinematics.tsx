import { useContext, useEffect } from 'react'
import { Context } from "../Map.tsx"
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

export const velocityManeger = (begin:boolean, spawn:SpawnAsset, setSpawns:(a:SpawnAsset[])=>void, indexSpawn:number, setRotate:(a:number)=>void):void => {
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
                })
                newSpawns[indexSpawn] = spawn

                return newSpawns
            })

            // get the angle towards motion
            setRotate(spawn.get2DAngleDegrees())
        }

    },[contextApp.graphTime])
}

export const graphicalManager = (graphObj:any, setSpawns:(a:SpawnAsset)=>void, indexSpawn:number, setGraphicalPosition:(a:Kinematics)=>void, spawn:SpawnAsset, mapWidth:number, mapHeight:number):void => {
    // import variables fromt he App.tsx
    const contextApp = useContext(Context)

    // adjust plane graphically to accurately represent its position
    useEffect(() => {
        // adjust size of asset depending on its size in the dom
        if (graphObj.current) {
            setSpawns( (spawns:SpawnAsset[]) => {
                let newSpawns = spawns
                newSpawns[indexSpawn].setSpawnArray({
                    ...newSpawns[indexSpawn].getSpawnArray(),
                    width: graphObj.current.clientHeight,
                    height: graphObj.current.clientWidth
                })
                return newSpawns
            })
        }

        // adjust the <x,y,z> position as the center of the object. (only for grpahical representation)
        setGraphicalPosition((prevGraphicalPosition) => {
            return{...prevGraphicalPosition, x: spawn.position.x - 100*(spawn.width/2)/mapWidth, y: spawn.position.y - 100*(spawn.height/2)/mapHeight}
        })
    }, [contextApp.masterWidth, contextApp.masterHeight, contextApp.graphTime])

}
