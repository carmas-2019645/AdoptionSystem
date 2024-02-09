'use strict'
 
import Animal from './animal.models.js'
import { checkUpdate } from '../utils/validator.js'
 
export const testA = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}
 
export const registerA = async (req, res) => {
    try {
        let data = req.body;
        console.log(data);
        let animal = new Animal(data);
        await animal.save();
        return res.send({ message: `Animal has been registered: ${animal.name}` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error registering user', error: err });
    }
}
 
export const loginA = async (req, res) => {
    try {
        //capturar los datos (body)
        let { name, species } = req.body
        //validar que el usurao exista
        let animal = await User.findOne({ name }) //buscar un solo registro, username: 'el que esta registrado'
        //verifico que la contraseña coincida
        let loggedUser = {
            name: animal.name,
        }
        //Responde al usuario
        return res.send({ message: `Welcome ${loggedUser.name}`, loggedUser })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error to login' })
    }
}
 
export const updateA = async (req, res) => {
    try {
        //Obtener el id del usuario a actualizar
        let { id } = req.params
        //Obtener los datos a actualizar
        let data = req.body
        //Validar si trae datos
        let update = checkUpdate(data, id)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannon be' })
        //Validar si tiene permisos (tokenización) X Hoy No lo vemos x
        //Actualizar (BD)
        let updateAnimal = await User.findOneAndUpdate(
            { _id: id }, //ObjerctsId <- hexadecimales (Hora sys, Version Mongo, LLave private..)
            data, // Los Datos que se van a actualizar
            { new: true }
        )
 
        //Validar la actualización
        if (!updateAnimal) return res.status(401).send({ message: 'have submitted some data that cannot be update or missing data' })
        return res.send({ message: 'Update user', updateAnimal })
    } catch (err) {
        console.error(err);
        if (err.keyValue.name) return res.status(400).send({ message: `Username ${err.keyValue.name} is alredy token` })
        return res.status(500).send({ message: 'Error updating account' })
    }
}
 
export const deleteA = async (req, res) => {
    try {
        let { id } = req.params
        let deletedAnimal = await User.findOneAndDelete({ _id: id })
        if (!deletedAnimal) return res.status(404).send({ message: 'Account not found and not deleted' })
        return res.send({ message: `Account with  ${deletedAnimal.name} deleted succesfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting account' })
    }
}