import React, { useRef, useState } from 'react'
import { TextBox, ToolBar } from '../Map'
// if clicked and drag to scroll
export function dragToScroll(e:React.MouseEvent<HTMLElement>, map_y:React.RefObject<HTMLElement>) {
    let drag = true
    let startX = e.clientX
    let startY = e.clientY
    let scrollLeft = window.scrollX
    let scrollRight = window.scrollY

    const movingScroll = (e:React.MouseEvent<HTMLElement>) => {
        if (!drag) return
        // prevent selection of text or objects
        e.preventDefault()

        const x = e.clientX
        const y = e.clientY
        const walkX = x - startX
        const walkY = y - startY
        window.scroll(scrollLeft - walkX, scrollRight - walkY)
    }
    map_y.current?.addEventListener('mousemove', movingScroll)

    map_y.current?.addEventListener('mouseup', () => {
        drag = false
    })

    map_y.current?.addEventListener('mouseleave', () => {
        drag = false
    })
}

export function dragToSelect(e:React.MouseEvent<HTMLElement>, map_y:React.RefObject<HTMLElement>){
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

    const startDrag = (e:React.MouseEvent<HTMLElement>) => {
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

export function toolAction(e:React.MouseEvent<HTMLElement>, map_y:React.RefObject<HTMLElement>, toolBar:ToolBar, textBox: TextBox[], setTextBox: (a:TextBox[])=>void) {
    if (toolBar === 'default') {dragToSelect(e, map_y)}
    else if (toolBar === "grab") {dragToScroll(e, map_y)}
    else if (toolBar === "cell") {placeText(e, map_y, textBox, setTextBox)}
    //else if (toolBar === "text") {setInMap([placeText(e, map_y)])}
}

function placeText(e:React.MouseEvent<HTMLElement>, map_y:React.RefObject<HTMLElement>, textBox: TextBox[], setTextBox: (a:TextBox[])=>void) {
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
        //let textDiv = document.createElement("div")
        //textDiv.setAttribute('id', 'text-box')
        //textDiv.style.cssText = "z-index: 20; top: " + y + "px; left: " + x + "px; position: absolute;"
        //textDiv.innerHTML = theText
        //map_y.current?.appendChild(textDiv)
        setTextBox([...textBox, {x, y, text: theText}])
    })
}

export function ParentPlaceText(){
    const [theTexts, setTheTexts] = useState<string[]>([])
    const [x, setX] = useState<number[]>([])
    const [y, setY] = useState<number[]>([])
    const [theRef, setTheRef] = useState<HTMLInputElement>()

    const [inFocus, setInFocus] = useState<boolean>(true)
    const inputEl = useRef<HTMLInputElement>(null)

    // if element is not in focus
    if (document.activeElement !== inputEl.current) {
        setInFocus(false)
    }

    return(
        <>
            {theTexts.map( (theText, index) => (
                <div className='z-20 absolute' style={{top: y[index], left: x[index]}}>{theText}</div>
            ))}
        </>
    )
}

export function PlaceText({x, y, text}:{x:number, y:number, text:string} ) {

    return (
        <>
        <input type="text" value={text}
            className='z-20 absolute'
            style={{top: y + 'px', left: x + 'px'}}
        autoFocus/>
        </>
    )
}


export function dragObj(e:MouseEvent, map_y:React.RefObject<HTMLElement>){
    // get the starting click poisition
    let startX = e.pageX
    let startY = e.pageY
    let drag = true

    const startDrag = (e:MouseEvent) => {
        if (!drag) return
        // prevent selection of text or objects
        e.preventDefault()
        // get the transversal position
        const x = e.pageX
        const y = e.pageY
        const walkX = x - startX
        const walkY = y - startY

    }
    map_y.current?.addEventListener('mousemove', startDrag)

    map_y.current?.addEventListener('mouseup', () => {
        drag = false
    document.getElementById('selection-box')?.remove()
    document.getElementById('qausi-box')?.remove()
    })
}