
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