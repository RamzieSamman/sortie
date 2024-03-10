import { useEffect } from 'react'
import { Spawn, SpawnAsset } from '../Auxiliary';
import missile from '../assets/missile.png'

export const displayKinematics = (begin:boolean, graphObj:any, setToggleDetail:(a:boolean)=>void) => {
    // if object is selected
    useEffect(() => {
        if (begin) {
            const handleClick = (event:any):void => {
            if (graphObj.current && graphObj.current.contains(event.target)) {
                setToggleDetail( toggleDetail => !toggleDetail)
                // The click was inside the component
            } else {
                setToggleDetail(false)
                // The click was outside the component
            }
            };

            document.addEventListener("click", handleClick);

            return () => {
            document.removeEventListener("click", handleClick);
            };
        }
    }, [graphObj]);
}


export const launchMissile = (setSpawns: any, spawn:SpawnAsset, mapWidth:number, mapHeight:number) => {

    const spawnMissile = (e:any):void => {
        if (e.key === ' ') {
            const angleOfAssetRad = spawn.get2DAngleDegrees() * Math.PI/180

            setSpawns( (spawns:SpawnAsset[]) => {
                // spawn the missile with the position and velocity
                const distanceFromAsset = Math.sqrt(Math.pow(spawn.height/mapHeight,2) + Math.pow(spawn.width/mapWidth,2))
                return [...spawns,
                    new SpawnAsset(
                        false,
                        missile,
                        {
                            x: spawn.position.x + (100 * (distanceFromAsset/2)) * Math.cos(angleOfAssetRad),
                            y: spawn.position.y + (100 * (distanceFromAsset/2)) * Math.sin(angleOfAssetRad),
                            z: spawn.position.z
                        },
                        {
                            x: spawn.velocity.x + 0.1 * Math.cos(angleOfAssetRad),
                            y: spawn.velocity.y + 0.1 * Math.sin(angleOfAssetRad),
                            z: spawn.velocity.z 
                        }, 0, 0)
                    ]
            })
        }
    }

    useEffect( () => {
        document.addEventListener('keydown', spawnMissile)

        // clean up
        return () => document.removeEventListener('keydown', spawnMissile)
    }, [spawn])
}