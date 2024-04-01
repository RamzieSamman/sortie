import { ToolBar, TextBox } from "../Map"

export function placeText(e:React.MouseEvent<HTMLDivElement, MouseEvent>, map_y:React.RefObject<HTMLElement>, 
    setToolBar:(a:ToolBar)=>void, textBox: TextBox[], setTextBox: (a:TextBox[])=>void) {
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
