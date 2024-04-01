import React from "react"

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