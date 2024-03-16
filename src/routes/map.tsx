import { createFileRoute, createLazyFileRoute } from '@tanstack/react-router'
import { Map } from '../Map'

export const Route = createFileRoute('/map')({
  component: () => <Map/>
}) 