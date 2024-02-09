import express from "express";
import { test} from "./animal.controller";


const api = express.Router()

api.get('/testA', test)

export default api