import { Link } from "@tanstack/react-router"
import React, { useContext, useState } from "react"

type tDialogOpts = {
    choice: number | null
    dialogNumber: number
}
type tContextDialog = {
    dialogOpts: tDialogOpts[];
    setDialogOpts: (a:any)=>void;
}
export const ContextDialog = React.createContext<tContextDialog>()

export function Dialogs() {
    const [dialogOpts, setDialogOpts] = useState<tDialogOpts[]>([{choice: null, dialogNumber: 0}])

  return (
    <ContextDialog.Provider value={{ dialogOpts, setDialogOpts }}>
        <div>
            <div className="border border-amber-600 bg-amber-600 text-slate-800 p-2 rounded-md ml-2 hover:cursor-pointer
            hover:bg-slate-800 hover:text-amber-600 hover:border-amber-600 hover:border text-center">
                <Link to='/map'>Skip Dialog</Link>
            </div>

            <div className="w-full text-white">
                {
                    dialogOpts.map( (dialogOpt, index:number) => (
                        <Dialog index={index} key={index} />
                    ))
                }
            </div>

        </div>
    </ContextDialog.Provider>
  )
}

export function Dialog({ index }: {index:number}) {
    const [mainCharecter, setMainCharecter] = useState<boolean>()
    const [dialogs, setDialogs] = useState([
        {
            character: 'sargent',
            text: 'First => Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, tempore non ad amet vel velit voluptates eveniet. Nisi aspernatur maxime doloremque eveniet deleniti. Velit error rerum dolores ratione cumque omnis.'
        },
        {
            character: 'main',
            text: 'Second => Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, tempore non ad amet vel velit voluptates eveniet. Nisi aspernatur maxime doloremque eveniet deleniti. Velit error rerum dolores ratione cumque omnis.'
        },
        {
            character: 'sargent',
            text: 'Third => Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, tempore non ad amet vel velit voluptates eveniet. Nisi aspernatur maxime doloremque eveniet deleniti. Velit error rerum dolores ratione cumque omnis.'
        },
        {
            character: 'main',
            text: 'Fourth => Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, tempore non ad amet vel velit voluptates eveniet. Nisi aspernatur maxime doloremque eveniet deleniti. Velit error rerum dolores ratione cumque omnis.'
        },
        {
            character: 'sargent',
            text: 'Fifth => Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, tempore non ad amet vel velit voluptates eveniet. Nisi aspernatur maxime doloremque eveniet deleniti. Velit error rerum dolores ratione cumque omnis.'
        },
    ])

    return (
        <div className="flex flex-row flex-nowrap m-2">
            {dialogs[index].character !== 'main' 
                ? <><Avatar/> <Response dialog={dialogs[index]} index={index} /></>
                : <><Response dialog={dialogs[index]} index={index} /><Avatar/></>
            }
        </div>
    )
}

export function Avatar() {
    return (
        <div className="w-48 h-48 bg-red-800 m-2 rounded-md flex-grow-0 flex-shrink-0"></div>
    )
}

export function Response({ index, dialog }:{index:number, dialog:{character:string, text:string}}) {
    return (
        <div className="h-48 w-full flex flex-col">
            <div>{ dialog.text }</div>
            <Choices index={ index }/>
        </div>
    )
}

export function Choices({ index }:{index: number}) {
    const contextDialog = useContext(ContextDialog)
    const [disable, setDisable] = useState<boolean>(false)
    const [selected, setSelected] = useState<number>(0)

    const choiceMade = (choice:number) => {
        if (!disable) {
            let newDialogOpts = contextDialog.dialogOpts
            newDialogOpts[index] = {...newDialogOpts[index], choice: choice}
            contextDialog.setDialogOpts([...newDialogOpts, {dialogNumber: 2, choice: null}])
        }

        // show that this is the selected dialog
        setSelected(choice)

        // prevent button from being selected again
        setDisable( true )
    }

    // class will reflect what botton is selected and will show it is disabled after a click for the user
    const getClass = (disable:boolean, choosen:boolean) => {
        if (!disable) {
            return ("border border-amber-300 bg-amber-300 text-slate-800 p-2 rounded-md ml-2 "
            + "hover:cursor-pointer hover:bg-slate-800 hover:text-amber-300 hover:border-amber-300 hover:border")
        } else {
            return ("border bg-slate-800 border-slate-800 p-2 rounded-md ml-2 " + (choosen ? 'text-amber-400 ': 'text-slate-400 '))
        }
    }

    return (
            <div className="flex flex-row">
                <div className={getClass(disable, selected === 0)} onClick={() => choiceMade(0)} >
                    I am new to circuits
                </div>
                <div className={getClass(disable, selected === 1)} onClick={() => choiceMade(1)} >
                    I know a couple of things
                </div>
            </div>
    )
}