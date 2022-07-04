import storage from 'electron-json-storage'
import { Request } from 'express'
import express from 'express'
import { ipcMain } from 'electron'
import cors from 'cors'
import { Server } from 'http'

const expressApp = express()

interface ReceiveTokenQueryTypes {
  token: string
}

var corsOptions = {
  credentials: true, 
  origin: ['http://lorgg.test', 'https://lor.gg']
}

expressApp.use(cors(corsOptions))

ipcMain.on('login', () => {
  require('electron').shell.openExternal("https://lor.gg/tracker-authentication")
  
  var expressListener : Server

  expressApp.get('/receive-token', (req : Request<unknown, unknown, unknown, ReceiveTokenQueryTypes>) => {
    
    // Converting token (string) to unkown then object
    storage.set('token', (req.query.token) as unknown as object, () => console.log("Saved"))
    
    expressListener.close( () => console.log("Listener Closed") )

  })

  expressListener = expressApp.listen(5674, '0.0.0.0', () => console.log("Listening on Port 5674"))
})