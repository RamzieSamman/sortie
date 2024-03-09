import { useEffect } from 'react'
import { Spawn } from '../Auxiliary';
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


export const launchMissile = (setSpawns: any, spawn:Spawn) => {

    const spawnMissile = (e:any):void => {
        if (e.key === ' ') {
            // get the velocity of plane
            const absVelocity = Math.sqrt(Math.pow(spawn.velocity.x, 2) + Math.pow(spawn.velocity.y, 2) + Math.pow(spawn.velocity.z, 2))
            const angleVelocity = Math.atan2(spawn.velocity.y, spawn.velocity.x)* 180/Math.PI
            const relativeVMissile = 2
            const relativePositionMissile = 15

            const missileVelocity = {
                x: spawn.velocity.x + relativeVMissile * Math.cos(angleVelocity),
                y: spawn.velocity.y + relativeVMissile * Math.sin(angleVelocity),
                z: spawn.velocity.z
            }
            const missilePosition = {
                x: spawn.position.x + relativePositionMissile * Math.cos(angleVelocity),
                y: spawn.position.y + relativePositionMissile * Math.sin(angleVelocity),
            }

            setSpawns( (spawns) => {
                return [...spawns,
                    {exploded: false, asset: missile, position: missilePosition, velocity: missileVelocity, width: 0, height: 0}]
            })
            console.log(spawn)
            console.log(spawn.width)
        }
    }

    useEffect( () => {
        document.addEventListener('keydown', spawnMissile)

        // clean up
        return () => document.removeEventListener('keydown', spawnMissile)
    }, [spawn])
}