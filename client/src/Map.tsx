import React, { useState, useRef, useEffect } from 'react'
import { collisionHandler } from './collider.tsx'
import { graphTimer, mapHandler, Spawn, SpawnAsset, spawnHandler} from './Auxiliary.tsx'
import PhysicsObj from './physicsObj/PhysicsObj.tsx'
import { launchMissile } from './physicsObj/Interaction.tsx'
import { outerToolAction, toolAction } from './mapInteractions/MapInteraction.tsx'
import cursorPointer from './assets/cursor-pointer.svg'
import cursorGrab from './assets/cursor-grab.svg'

interface ContextProvider {
  masterWidth: number,
  masterHeight: number,
  graphTime: number,
  begin: boolean,
  spawns: Spawn[],
  setSpawns: (a:any)=>void
}

export type TextBox = {
  x: number
  y: number
  text: string
  width: number
  height: number
}

const ToolBars = ["default", "grab", "cell", "move", "text"] as const
export type ToolBar = typeof ToolBars[number]

export const Context = React.createContext<ContextProvider>()

export function Map() { // 480p resolution
  const resolution: {x: number, y:number} = {x: 640, y: 480}

  // trajectories with z = -1, ensures it does not collide on init
  const [spawns, setSpawns] = useState<SpawnAsset[]>([])
  const [updateSpawns, setUpdateSpawns] = useState<number>(0)
  const [begin, setBegin] = useState<boolean>(false)
  const [toolBar, setToolBar] = useState<ToolBar>("default")
  const [textBox, setTextBox] = useState<TextBox[]>([{x: 0, y: 0, text: '', width: 0, height: 0}])

  // set the graphic/mechanical timer
  const graphTime:number = graphTimer()

  // sets the map specification, and adjust for dynamic situations
  const map_y = useRef<HTMLInputElement>(null)
  const [masterWidth, masterHeight] = mapHandler(map_y)

  // handle spans creation, destruction and properties
  spawnHandler(spawns, setSpawns, updateSpawns)

  // determine if collision occured and update states
  collisionHandler(begin, spawns, setSpawns, graphTime, masterWidth, masterHeight)

  // upon clicking the button, toggle pause or play
  const toggleBegin = () => {
    setBegin( (begin) => !begin)
  }

  // spawn rockets
  launchMissile(setSpawns, spawns[0], masterWidth, masterHeight) 

  return (
    <Context.Provider value={{masterWidth, masterHeight, graphTime, begin, spawns, setSpawns}}>
        <div className="relative z-0 font-['Virgil']" style={{cursor: toolBar}}
        onMouseDown={(e) => outerToolAction(e, map_y, toolBar, setToolBar, textBox, setTextBox)}
        >
          <div 
            style={{
                backgroundSize: '10px 10px', backgroundImage: 'linear-gradient(to right, #d9d9d9 1px, transparent 1px), linear-gradient(to bottom, #d9d9d9 1px, transparent 1px)',
                width: '15000px', height: '15000px'
              }}
            ref={map_y}
          onMouseDown={(e) => toolAction(e, map_y, toolBar, setToolBar, textBox, setTextBox)}
          >
          </div>
              {spawns.map( (spawn, index) => (
              <PhysicsObj
                  key={index}
                  width={75}
                  spawn={spawn}
                  indexSpawn={index}
              />
              ))}

              <PlaceTexts theTexts={textBox} toolBar={toolBar} setToolBar={setToolBar} setTheTexts={setTextBox}/>

            <div className="fixed z-10 select-none bg-white border-2 border-slate-300 rounded-md mt-3 flex flex-col" style={{left: '20px', top: '0px'}}>
                <div className='py-2 px-2 m-1 rounded-sm cursor-pointer hover:bg-orange-100' onClick={()=> setToolBar('default')}> <img src={cursorPointer} width="20px" /> </div>
                <div className='py-2 px-2 m-1 rounded-sm cursor-pointer hover:bg-orange-100' onClick={() => setToolBar('grab')}> <img src={cursorGrab} width="20px" /> </div>
                <div className='py-2 px-2 m-1 rounded-sm cursor-pointer hover:bg-orange-100' onClick={() => setToolBar('cell')}> <span className='font-bold'>tx</span> </div>
            </div>
        </div>
        <button className="bg-indigo-500 m-4 p-4" onClick={toggleBegin}>begin</button>
    </Context.Provider>
  )
}

function PlaceTexts({theTexts, toolBar, setToolBar, setTheTexts}:{theTexts:TextBox[], toolBar: ToolBar, setToolBar: (a:ToolBar)=>void, setTheTexts: (a:TextBox[])=>void}) {

  return (
    <>
      {theTexts.map( (theText, index) => (<PlaceText theTexts={theTexts} setTheTexts={setTheTexts} theText={theText} toolBar={toolBar} setToolBar={setToolBar} index={index} key={index} />))}
    </>
  )
}

function PlaceText({ theTexts, setTheTexts, theText, toolBar, setToolBar, index}:{ theTexts:TextBox[], setTheTexts:(a:TextBox[])=>void, theText:TextBox, toolBar: ToolBar, setToolBar: (a:ToolBar)=>void, index:number}){
  const [onFocus, setOnFocus] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null) 
  const [position, setPosition] = useState<{x:number, y:number}>({x:theText.x, y:theText.y})
  const [edit, setEdit] = useState<boolean>(false)
  const [newText, setNewText] = useState<string>(theText.text)

  const dragObj = (e:MouseEvent) => {
    if (toolBar !== 'default') return
    // get the starting click poisition
    let startX = e.offsetX
    let startY = e.offsetY
    let drag = true

    const startDrag = (e:MouseEvent) => {
        if (!drag) return
        // prevent selection of text or objects
        e.preventDefault()
        // get the transversal position
        const x = e.pageX
        const y = e.pageY
        setPosition({x: x - startX, y: y - startY})
        
    }
    document.addEventListener('mousemove', startDrag)
    document.addEventListener('mouseup', (e:MouseEvent) => {
      drag = false
      doubleClick(e)
      document.removeEventListener('mousemove', startDrag)

      // update position in the textboxs array
      let newTextArray = theTexts
      newTextArray[index] = {...newTextArray[index], x: position.x, y: position.y}
      setTheTexts(newTextArray)
    })
    document.addEventListener('mouseleave', () => {
      drag = false
      document.removeEventListener('mousemove', startDrag)

      // update position in the textboxs array
      let newTextArray = theTexts
      newTextArray[index] = {...newTextArray[index], x: position.x, y: position.y}
      setTheTexts(newTextArray)
    })
}

  useEffect( () => {
    if (toolBar === 'default') {
      ref.current?.addEventListener('mousedown', dragObj)
    }

    return () => {
      ref.current?.removeEventListener('mousedown', dragObj)
    }
  }, [toolBar, edit])

  const toSetFocus = (toolBar:ToolBar) => {
    if (toolBar === 'default') {
      setOnFocus(true)
    }
  }

  const doubleClick = (e:MouseEvent) => {
    if (textAreaRef.current) {
      let newTheTexts = theTexts
      newTheTexts[index] = {...theText, width: textAreaRef.current?.clientWidth, height: textAreaRef.current?.clientWidth}
      setTheTexts(newTheTexts)
    }
  }

  if (edit) {
    return (
      <textarea name={theText.text} value={newText} 
        className={'p-1 z-20 absolute border-dashed border-2 border-slate-500 hover:cursor-move bg-transparent outline-none'}
        style={{ top: position.y, left: position.x, resize: 'both'}}
        onChange={(e)=> setNewText(e.target.value)}
        onBlur={() => setEdit(false)}
        ref={textAreaRef}
      autoFocus={true}/>
    )
  } else {
    return(
      <div className={'p-1 z-20 absolute border-dashed border-2 ' + (onFocus ? 'border-slate-500 hover:cursor-move' : 'border-transparent')}
      style={{top: position.y, left: position.x, userSelect: "none", width: theText.width, height: theText.height}}
      onClick={()=>toSetFocus(toolBar)} 
      onDoubleClick={() => setEdit(true)}
      onBlur={()=>setOnFocus(false)}
      ref={ref}
      tabIndex={1}
      >{newText}</div>
    )
  }
}