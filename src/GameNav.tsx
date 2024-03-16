import { useState } from "react"

export function GameNav() {
  const [selected, setSelected] = useState<string>('mission')

  return (
    <nav className="m-2 border-r-2 p-3 border-slate-600">
      <div className={"p-1 hover:cursor-pointer " + (selected === 'mission' ? "text-amber-300 border-b-2 border-slate-600 " : "text-slate-400 ")}
      onClick={()=>{setSelected('mission')}}
      >
        Mission
      </div>
      <div className={"p-1 hover:cursor-pointer " + (selected === 'editor' ? "text-amber-300 border-b-2 border-slate-600 " : "text-slate-400 ")}
      onClick={()=>{setSelected('editor')}}
      >
        Editor
      </div>
      <div className={"p-1 hover:cursor-pointer " + (selected === 'debriefing' ? "text-amber-300 border-b-2 border-slate-600 " : "text-slate-400 ")}
      onClick={()=>{setSelected('debriefing')}}
      >
        Debriefing
      </div>
    </nav>
  )
}