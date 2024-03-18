import { Hono } from 'hono'

const app = new Hono()

app.get("/hello", c => {
    return c.json({users: 'world'})
})

Bun.serve({
    fetch: app.fetch,
    port: 3000
})
