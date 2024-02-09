import express from "express";
import { deleteU, login, register, test, update} from "./user.controller.js";


const api = express.Router()

api.get('/test', test)
api.post('/register', register)
api.post('/login', login)
api.put('/update/:id', update) 
api.delete('/delete/:id', deleteU)

export default api