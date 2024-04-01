import React, { useEffect, useRef, useState } from 'react'
import { TextBox, ToolBar, BoolObject } from '../Map'
import { boolPlacement } from './BoolObject'
import { dragToScroll } from './Grab'
import  { placeText } from './Text'
import { dragToSelect } from './default'

export function outerToolAction(e:React.MouseEvent<HTMLDivElement, MouseEvent>, map_y:React.RefObject<HTMLElement>, toolBar:ToolBar, setToolBar:(a:ToolBar)=>void, textBox: TextBox[], setTextBox: (a:TextBox[])=>void) {
    if (toolBar === "grab") {dragToScroll(e)}
}

export function toolAction(e:React.MouseEvent<HTMLDivElement, MouseEvent>, map_y:React.RefObject<HTMLElement>,
    toolBar:ToolBar, setToolBar: (a:ToolBar)=>void, textBox: TextBox[], setTextBox: (a:TextBox[])=>void,
    boolObjects: BoolObject[], setBoolObjects: (a:BoolObject[])=>void) {
    if (toolBar === 'default') {dragToSelect(e, map_y)}
    else if (toolBar === "cell") {placeText(e, map_y, setToolBar, textBox, setTextBox)}
    else if (toolBar === "andGate") {boolPlacement(e, boolObjects, setBoolObjects)}
}

