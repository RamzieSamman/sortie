import { useEffect } from 'react'

export const displayKinematics = (begin:boolean, graphObj:any, setToggleDetail:(a:boolean)=>void) => {
    // if object is selected
    useEffect(() => {
        if (begin) {
            const handleClick = (event:any):void => {
            if (graphObj.current && graphObj.current.contains(event.target)) {
                setToggleDetail( toggleDetail => !toggleDetail)
                // The click was inside the component
            } else {
                setToggleDetail(false)
                // The click was outside the component
            }
            };

            document.addEventListener("click", handleClick);

            return () => {
            document.removeEventListener("click", handleClick);
            };
        }
    }, [graphObj]);
}