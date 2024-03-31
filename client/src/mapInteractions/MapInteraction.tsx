import React, { useEffect, useRef, useState } from 'react'
import { TextBox, ToolBar, BoolObject } from '../Map'
import andGate from '../assets/and_gate.svg'
// if clicked and drag to scroll
export function dragToScroll(e:React.MouseEvent<HTMLDivElement, MouseEvent>) {
    let drag = true
    let startX = e.clientX
    let startY = e.clientY
    let scrollLeft = window.scrollX
    let scrollRight = window.scrollY

    const movingScroll = (e:MouseEvent) => {
        if (!drag) return
        // prevent selection of text or objects
        e.preventDefault()

        const x = e.clientX
        const y = e.clientY
        const walkX = x - startX
        const walkY = y - startY
        window.scroll(scrollLeft - walkX, scrollRight - walkY)
    }
    document.body.addEventListener('mousemove', movingScroll)

    document.body.addEventListener('mouseup', () => {
        drag = false
        document.body.removeEventListener('mousemove', movingScroll)
    })

    document.body.addEventListener('mouseleave', () => {
        drag = false
        document.body.removeEventListener('mousemove', movingScroll)
    })
}

export function dragToSelect(e:React.MouseEvent<HTMLDivElement, MouseEvent>, map_y:React.RefObject<HTMLElement>){
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

    const startDrag = (e:MouseEvent) => {
        if (!drag) return
        // prevent selection of text or objects
        e.preventDefault()
        // get the transversal position
        const x = e.pageX
        const y = e.pageY
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

    map_y.current?.addEventListener('mouseup', () => {
        drag = false
    document.getElementById('selection-box')?.remove()
    document.getElementById('qausi-box')?.remove()
    })
}

export function outerToolAction(e:React.MouseEvent<HTMLDivElement, MouseEvent>, map_y:React.RefObject<HTMLElement>, toolBar:ToolBar, setToolBar:(a:ToolBar)=>void, textBox: TextBox[], setTextBox: (a:TextBox[])=>void) {
    if (toolBar === "grab") {dragToScroll(e)}
}

export function toolAction(e:React.MouseEvent<HTMLDivElement, MouseEvent>, map_y:React.RefObject<HTMLElement>,
    toolBar:ToolBar, setToolBar: (a:ToolBar)=>void, textBox: TextBox[], setTextBox: (a:TextBox[])=>void,
    boolObjects: BoolObject[], setBoolObjects: (a:BoolObject[])=>void) {
    if (toolBar === 'default') {dragToSelect(e, map_y)}
    else if (toolBar === "cell") {placeText(e, map_y, setToolBar, textBox, setTextBox)}
    else if (toolBar === "andGate") {
        console.log('see') 
        boolPlacement(e, boolObjects, setBoolObjects)}
    console.log(toolBar)
}

function placeText(e:React.MouseEvent<HTMLDivElement, MouseEvent>, map_y:React.RefObject<HTMLElement>, setToolBar:(a:ToolBar)=>void, textBox: TextBox[], setTextBox: (a:TextBox[])=>void) {
    // get the location of the text
    const x = e.pageX
    const y = e.pageY

    // create input element
    let textInput = document.createElement("textarea")
    textInput.setAttribute('id', 'input-box')
    textInput.style.cssText = "z-index: 20; top: " + y + "px; left: " + x + "px; position: absolute;"

    // add it to the DOM and focus on it
    map_y.current?.appendChild(textInput)
    window.setTimeout( () => textInput.focus(), 0)

    // delete input on focus and create div instead
    textInput.addEventListener('focusout', () => {
        const theText = textInput.value
        textInput.remove()
        setTextBox([...textBox, {x, y, text: theText, width: 200, height: 36}])
        setToolBar("default")
    })

    // set curor to a text icon while the input box is editable
    setToolBar("text")

}

export function BoolElement({boolObject}:{boolObject:BoolObject}) {

    return (
        <div className='z-20 absolute' style={{top: boolObject.y, left: boolObject.x}}>
            <img src={andGate} width='102.2px' />
        </div>
    )
}

export function ObjectPlacement() {
    const [x, setX] = useState<number>(0)
    const [y, setY] = useState<number>(0)

    const objectPlacement = (e:MouseEvent) => {
        setX(10*Math.floor((e.pageX - 25)/10))
        setY(10*Math.floor((e.pageY - 35)/10))
    }

    useEffect( () => {
        document.addEventListener('mousemove', objectPlacement)
        console.log('beep')

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

export function boolPlacement(e:React.MouseEvent<HTMLDivElement, MouseEvent>, boolObjects:BoolObject[], setBoolObjects:(a:BoolObject[])=>void){
    const x = 10*Math.floor((e.pageX - 25)/10)
    const y = 10*Math.floor((e.pageY - 35)/10)
    
    // push object to list to be printed
    boolObjects.push({x:x, y:y, object: 'AndGate'})
    setBoolObjects(boolObjects)
}