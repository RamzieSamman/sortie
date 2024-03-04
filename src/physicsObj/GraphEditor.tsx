import { useEffect, useState } from 'react'
import { Spawn } from '../Auxiliary'

export const placementManeger = (begin:boolean, graphObj:any, toggleDetail:boolean, setToggleDetail:(a:boolean)=>void, setRotate:(a:number)=>void, rotate:number, indexSpawn:number, setSpawns:(a:Spawn)=>void, spawns:Spawn[]):void => {
    const [angleChange, setAngleChange] = useState<number>(0)

    const constAdjustVelocity = (angleChange:number) => {
        setSpawns((prevSpawns) => {
            let newSpawns:Spawn[] = [...prevSpawns]
            const spawn = prevSpawns[indexSpawn]
            //const oldAngle = Math.atan2(spawn.velocity.y, spawn.velocity.x) * 57.2958
            const velocityMagnitude = Math.abs(Math.pow(spawn.velocity.x, 2) + Math.pow(spawn.velocity.y, 2))
            
            console.log('the thing = ' + angleChange)
            console.log('old = ' + spawn.velocity.x)
            console.log('mag = ' + velocityMagnitude)
            console.log('new_x = ' + velocityMagnitude * Math.cos(angleChange))
            console.log('new_y = ' + velocityMagnitude * Math.sin(angleChange))
            newSpawns[indexSpawn] = {
                ...spawn,
                velocity: {x: velocityMagnitude * Math.sin(angleChange * Math.PI/180), y: velocityMagnitude * Math.cos(angleChange * Math.PI/180), z:0},
            }
            return newSpawns
        })
    }

    const getVelocityAngle = (spawns:Spawn[], indexSpawn:number):number => {
        spawns[indexSpawn]
        return Math.atan(spawns[indexSpawn].velocity.y/spawns[indexSpawn].velocity.x) * 57.2958
    }

    // rotate the asset in accordance to the scroll wheel
    const rotateThing = (e:any):void => {
        // update the new angle
        let newRotate:number|null = null
        // set this for graphical purpose, but this will be overridden in kinematics
        setRotate( (rotate) => {
            // add to the existing angle
            newRotate = rotate - e.deltaY/10
            console.log(newRotate)

            // keep the angle between 0+-360 and return the angle
            if (newRotate > 360) {
                newRotate = newRotate //- 360
                setAngleChange(newRotate)
                return newRotate = newRotate
            } else if (newRotate < -360){
                newRotate = newRotate //+ 360
                setAngleChange(newRotate)
                return newRotate
            } else {
                setAngleChange(newRotate)
                return newRotate
            }
        })
    }

    const reposition = (e:any) => {
        // move left upon pressing 'a' or '<'
        if (e.key === 'a' || e.key === '<') {
            setSpawns( (prevSpawns: Spawn[]) => {
                let newSpawns:Spawn[] = [...prevSpawns]
                const spawn = prevSpawns[indexSpawn]
                newSpawns[indexSpawn] = {
                    ...spawn,
                    position: {x: -1 + spawn.position.x, y: spawn.position.y, z:0},
                }
                return newSpawns
            })
        }

        // move right upon pressing 'd' or '>'
        if (e.key === 'd' || e.key === '>') {
            setSpawns( (prevSpawns: Spawn[]) => {
                let newSpawns:Spawn[] = [...prevSpawns]
                const spawn = prevSpawns[indexSpawn]
                newSpawns[indexSpawn] = {
                    ...spawn,
                    position: {x: 1 + spawn.position.x, y: spawn.position.y, z:0},
                }
                return newSpawns
            })
        }

        // move down upon pressing 's' or uparrow key
        if (e.key === 's' || e.keyCode === 38) {
            setSpawns( (prevSpawns: Spawn[]) => {
                let newSpawns:Spawn[] = [...prevSpawns]
                const spawn = prevSpawns[indexSpawn]
                newSpawns[indexSpawn] = {
                    ...spawn,
                    position: {x: spawn.position.x, y: -1 + spawn.position.y, z:0},
                }
                return newSpawns
            })
        }

        // move up upon pressing 'w' or '^'
        if (e.key === 'w' || e.key === '^') {
            setSpawns( (prevSpawns: Spawn[]) => {
                let newSpawns:Spawn[] = [...prevSpawns]
                const spawn = prevSpawns[indexSpawn]
                newSpawns[indexSpawn] = {
                    ...spawn,
                    position: {x: spawn.position.x, y: 1 + spawn.position.y, z:0},
                }
                return newSpawns
            })
        }
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

