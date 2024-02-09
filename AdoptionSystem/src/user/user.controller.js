'use strict'

import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import User from './user.model.js'



export const test = (req, res) => {
    console.log('test is running')
    return res.send({message: 'Test is runing'})
}

export const register = async(req, res)=>{
    try {
        //Captturar el foormulario (body)
        let data = req.body
        //Encriptar la contraseña
        data.password = await encrypt(data.password)
        //Asignar el rol por defecto
        data.role = 'CLIENT'
        //Guardar la informacion en a DB
        let user = new User(data)
        await user.save()
        //Responder al usuario
        return res.send({message: `Registered successfully, can be logged with username ${user.username}`})
    } catch (error) {
        console.log(err)
        return res.status(500).send({message: 'Error registering user'})

    }
}

export const login = async(req, res) => {
    try {
        //Capturar los datos (body)
        let { username, password } = req.body
        //Validar que el usuario exista
        let user = await User.findOne({username}) //buscar un solo registro. username: 'ccabrera'
        //Verifico que la contraseña coincida
        if(user && await checkPassword(password, user.password)){
            let loggedUser = {
                username: user.username,
                name: user.name,
                role: user.role
            }
            //Responder al usuario
            return res.send({message: `Welcome ${loggedUser.name}`, loggedUser})
        }
        return res.status(404).send({message: 'Invalid credential'})
    } catch (error) {
        console.error(err)
        return res.status(500).send({message: 'Error to login'})
    }
}

export const update = async (req, res)=>{
    try{
        //Obtener el id del usuario a actualizar 
        let {id} = req.params
        //Obtener los datos a actualizar
        let data = req.body
        //Validar si trae datos
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannon be'})
        //Validar si tiene permisos (tokenización) X Hoy No lo vemos x
        //Actualizar (BD)
        let updateUser = await User.findOneAndUpdate(
            {_id: id}, //ObjerctsId <- hexadecimales (Hora sys, Version Mongo, LLave private..)
            data, // Los Datos que se van a actualizar
            {new: true}
        )

        //Validar la actualización
        if(!updateUser) return res.status(401).send({message: 'have submitted some data that cannot be update or missing data'})
        return res.send({message: 'Update user', updateUser})
    }catch(err){
        console.error(err);
        if(err.keyValue.username) return res.status(400).send({message: `Username ${err.keyValue.username} is alredy token`})
        return res.status(500).send({message: 'Error updating account'})

    }
}

export const deleteU = async(req, res)=>{
    try{
        //Obtener id
        let { id } = req.params
        //Validar si está logiado y es el mismo X no lo vemos hoy X
        //Eliminar (deleteOne / findOneAndDelete)
        let deleteUser = await User.findOneAndDelete({_id: id})
        //Verificar que se eliminó 
        if(!deleteUser) return res.status(404).send({message: 'Account not found and not delete'})
        //Responder
        return res.send({message: `Account with username ${deleteUser.username} delete successfully`}) //Status 200
    }catch(err){
        console.error(err)
            return res.status(500).send({message: 'Error deleting account'})
    }
}

