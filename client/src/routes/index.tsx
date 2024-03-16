import { createFileRoute, createLazyFileRoute } from '@tanstack/react-router'
import { GameNav } from '../GameNav'
import { Dialogs } from '../Dialogs'

export const Route = createFileRoute('/')({
  component: () => (
      <div className="w-full bg-slate-800 h-full p-4 flex flex-row">
        <GameNav/>
        <Dialogs/>
      </div>
  )
})