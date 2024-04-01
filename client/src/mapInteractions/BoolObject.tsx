import React, { useEffect, useState } from 'react'
import { BoolObject } from '../Map'
import andGate from '../assets/and_gate.svg'

export function BoolElement({boolObject}:{boolObject:BoolObject}) {

    return (
        <div className='z-20 absolute flex flwx-row' style={{top: boolObject.y, left: boolObject.x,
        backgroundImage: 'url(' + andGate + ')', backgroundSize: 'cover', width: '102.2px', height: '40px'}}>
            <div className='w-1/4'></div>
            <div className='w-1/2'></div>
            <div className=' w-1/4 flex flex-col justify-center'>
                <div className=' hover:bg-slate-700 rounded-full w-3 h-3 ml-auto mr-0'></div>
            </div>
        </div>
    )
}

export function ObjectPlacement() {
    const [x, setX] = useState<number>(0)
    const [y, setY] = useState<number>(0)

    const objectPlacement = (e:MouseEvent) => {
        setX(10*Math.floor((e.pageX - 25)/10))
        setY(10*Math.floor((e.pageY - 50)/10))
    }

    useEffect( () => {
        document.addEventListener('mousemove', objectPlacement)

        return () => {
            document.removeEventListener('mousemove', objectPlacement)
        }
    }, [])

    return (
        <div className='z-20 absolute' style={{top: y, left: x}}>
            <img src={andGate} width='102.2px' />
        </div>
    )
}

export function boolPlacement(e:React.MouseEvent<HTMLDivElement, MouseEvent>, boolObjects:BoolObject[],
    setBoolObjects:(a:BoolObject[])=>void){
    const x = 10*Math.floor((e.pageX - 25)/10)
    const y = 10*Math.floor((e.pageY - 50)/10)
    
    // push object to list to be printed
    boolObjects.push({x:x, y:y, object: 'AndGate'})
    setBoolObjects(boolObjects)
}