import { Server, Socket } from "socket.io"

import http from "http"

import app from './httpServer'
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { Users } from "./entity/Users"

const PORT = 4000

const httpServer = http.createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["POST"]
  }
});

app.set('io' , io)

export interface ExtWebSocket extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap> {
  mySelf: Users
}



// authentication provide you id => .
io.use(async (socket: ExtWebSocket, next) => {

  const client = socket.handshake.auth.client

  socket.mySelf = client

  next();

});


io.on('connection', (socket: ExtWebSocket) => {
  // join your id room 
  console.log(socket.mySelf)
  if (socket.mySelf !== undefined) {
    socket.join(`${socket.mySelf.id}`)
    socket.to([...socket.mySelf.friends.map(fr => `${fr.id}`)]).emit('connected', 'connected')
  }


})

export { io }

httpServer.listen(PORT, () => {

  console.log(`server listen on port  ${PORT}`)

  // delete  a status that is create after 24 hours .
})
