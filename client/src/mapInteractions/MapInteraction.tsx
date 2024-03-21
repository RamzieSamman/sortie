
  // if clicked and drag to scroll
export function dragToScroll(e:any, map_y:any) {
    let drag = true
    let startX = e.clientX
    let startY = e.clientY
    let scrollLeft = window.scrollX
    let scrollRight = window.scrollY

    const movingScroll = (e) => {
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

    map_y.current?.addEventListener('mouseup', (e) => {
        drag = false
    })

    map_y.current?.addEventListener('mouseleave', (e) => {
        drag = false
    })
}

export function dragToSelect(e, map_y){
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

    const startDrag = (e) => {
        if (!drag) return
        // prevent selection of text or objects
        e.preventDefault()

        // get the transversal position
        const x = e.pageX
        const y = e.pageY
        console.log(x)
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

    map_y.current?.addEventListener('mouseup', (e) => {
        drag = false
    document.getElementById('selection-box')?.remove()
    document.getElementById('qausi-box')?.remove()
    })
}