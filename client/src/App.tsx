import { useEffect, useState } from "react"
import ThemeProvider from "./components/theme-provider"
import { Link, Outlet } from '@tanstack/react-router'

function App() { // 480p resolution
      //<Link to='/'>Homepage</Link>

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Outlet/>
    </ThemeProvider>
  )
}

export default App