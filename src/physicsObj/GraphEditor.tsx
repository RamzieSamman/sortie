import { useEffect, useState } from 'react'
import { SpawnAsset } from '../Auxiliary'

export const placementManeger = (begin:boolean, graphObj:any, toggleDetail:boolean, setToggleDetail:(a:boolean)=>void, setRotate:(a:number)=>void, rotate:number, indexSpawn:number, setSpawns:(a:SpawnAsset)=>void, spawns:SpawnAsset[]):void => {
    const [angleChange, setAngleChange] = useState<number>(spawns[indexSpawn].get2DAngleDegrees())

    const constAdjustVelocity = (angleChange:number):void => {
        setSpawns((prevSpawns:SpawnAsset[]) => {
            // grab a copy of the spawns and the spawn of concern
            let newSpawns = prevSpawns
            let spawn = prevSpawns[indexSpawn]

            // mutate position and update array
            spawn.set2DVelocityFromAngle(angleChange)
            
            // push the new array in the useState
            newSpawns[indexSpawn] = spawn
            return newSpawns
        })
    }

    // rotate the asset in accordance to the scroll wheel
    const rotateThing = (e:any):void => {
        // update the new angle
        let newRotate:number = 0
        // set this for graphical purpose, but this will be overridden in kinematics
        setRotate( (rotate) => {
            // add to the existing angle
            newRotate = rotate + e.deltaY/10
            setAngleChange(newRotate)
            return newRotate
        })
    }

    const reposition = (e:any):SpawnAsset[] => {
        // move left upon pressing 'a' or '<'
        if (e.key === 'a' || e.key === '<') {
            setSpawns( (prevSpawns: SpawnAsset[]) => {
                // grab a copy of the spawns and the spawn of concern
                let newSpawns = prevSpawns
                let spawn = prevSpawns[indexSpawn]

                // mutate position and update array
                spawn.setSpawnArray({...spawn.getSpawnArray(), position: {x: -1 + spawn.position.x, y: spawn.position.y, z:0}})
                newSpawns[indexSpawn] = spawn

                // push the new array in the useState
                return newSpawns 
            })
        }

        // move right upon pressing 'd' or '>'
        if (e.key === 'd' || e.key === '>') {
            setSpawns( (prevSpawns: SpawnAsset[]) => {
                // grab a copy of the spawns and the spawn of concern
                let newSpawns = prevSpawns
                let spawn = prevSpawns[indexSpawn]

                // mutate position
                spawn.setSpawnArray({...spawn.getSpawnArray(), position: {x: spawn.position.x + 1, y: spawn.position.y, z:0}})
                newSpawns[indexSpawn] = spawn

                return newSpawns
            })
        }

        // move down upon pressing 's' or uparrow key
        if (e.key === 's' || e.keyCode === 38) {
            setSpawns( (prevSpawns: SpawnAsset[]) => {
                // grab a copy of the spawns and the spawn of concern
                let newSpawns = prevSpawns
                let spawn = prevSpawns[indexSpawn]

                // mutate position and update array
                spawn.setSpawnArray({...spawn.getSpawnArray(), position: {x: spawn.position.x, y: spawn.position.y - 1, z:0}})
                newSpawns[indexSpawn] = spawn

                // push the new array in the useState
                return newSpawns
            })
        }

        // move up upon pressing 'w' or '^'
        if (e.key === 'w' || e.key === '^') {
            setSpawns( (prevSpawns: Spawn[]) => {
                // grab a copy of the spawns and the spawn of concern
                let newSpawns = prevSpawns
                let spawn = prevSpawns[indexSpawn]

                // mutate position and update array
                spawn.setSpawnArray({...spawn.getSpawnArray(), position: {x: spawn.position.x, y: spawn.position.y + 1, z:0}})
                newSpawns[indexSpawn] = spawn

                // push the new array in the useState
                return newSpawns
            })
        }

        return spawns
    }

    useEffect(() => {
        if (begin) {
            // upon clicking the asset, deselect everything else and add event listeners
            const handleClick = (event:any):void => {
                // The click was inside the component
                if (graphObj.current && graphObj.current.contains(event.target)) {
                    setToggleDetail( toggleDetail => !toggleDetail)

                    // user can use scroll wheel to change rotation of the asset
                    document.addEventListener('wheel', rotateThing)
                    document.addEventListener('keydown', reposition)

                // The click was outside the component, clean up and deselect
                } else {
                    setToggleDetail(false)
                    document.removeEventListener('wheel', rotateThing)
                    document.removeEventListener('keydown', reposition)
                }
            };

            // upon clicking the asset, toggle the toggleDetail so other components now it is selected
            // add event listeners change rotation
            document.addEventListener("click", handleClick);

            // clean up and leave
            return () => {
                document.removeEventListener("click", handleClick);

            };
        }
    }, [graphObj])

    useEffect(() => {
        if (!toggleDetail) {
            constAdjustVelocity(angleChange)
        }
    }, [toggleDetail])

}

