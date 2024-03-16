import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import App from '../App'

import { createFileRoute, createLazyFileRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => <App/>,
})