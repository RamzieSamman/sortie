import ThemeProvider from "./components/theme-provider"
import { Link, Outlet } from '@tanstack/react-router'

function App() { // 480p resolution

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Link to='/'>Homepage</Link>
      <Outlet/>
    </ThemeProvider>
  )
}

export default App