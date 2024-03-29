import { useRef, useState, useEffect } from "react"
import { TextBox, ToolBar } from "../Map"

export function PlaceTexts({theTexts, toolBar, setToolBar, setTheTexts}:{theTexts:TextBox[], toolBar: ToolBar, setToolBar: (a:ToolBar)=>void, setTheTexts: (a:TextBox[])=>void}) {

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

  const toSetFocus = (toolBar:ToolBar) => {
    if (toolBar === 'default') {
      setOnFocus(true)
    }
  }

  const doubleClick = (e:MouseEvent) => {
    if (textAreaRef.current) {
      let newTheTexts = theTexts
      newTheTexts[index] = {...theText, width: textAreaRef.current?.clientWidth, height: textAreaRef.current?.clientHeight}
      setTheTexts(newTheTexts)
    }
  }
  dragEvent(toolBar, theTexts, index, position, ref, edit, setPosition, setTheTexts, doubleClick)

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

type Position = {x:number, y:number}
const dragEvent = (toolBar: ToolBar, theTexts:TextBox[], index:number,
  position:Position, ref:React.MutableRefObject<HTMLDivElement | null>, edit:boolean, setPosition:(a:Position)=>void,
  setTheTexts:(a:TextBox[])=>void, doubleClick: (e:MouseEvent)=>void) => {

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

}
