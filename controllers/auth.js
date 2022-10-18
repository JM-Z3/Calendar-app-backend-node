const {response} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');


const createUser = async(request, response = response) => {
    
    const { email, password} = request.body;

    try {

        let user = await User.findOne({email});
        if(user) {
            return response.status(400).json({
                ok:false,
                msg:'el usuario ya existe'
            });
        }

        user = new User(request.body);

        //encriptar password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );
        await user.save();
        //generar jwt
        const token = await generateJWT(user.id, user.name);

        response.status(201).json({
            ok:true,
            uid:user.id,
            name:user.name,
            token
        });
        } catch (error) {
            console.log(error)
            response.status(500).json({
                ok:false,
                msg:'Por favor comuniquese con el administrador'
            })
        }
    
};



const loginUser = async(request, response = response) => {

    const { email, password} = request.body;



    try {
        const user = await User.findOne({email});
        if(!user) {
            return response.status(400).json({
                ok:false,
                msg:'El usuario no existe',
            });
        }

        //confirmar los passwords
        const validPassword = bcrypt.compareSync(password, user.password);
        if(!validPassword) {
            return response.status(400).json({
                ok:false,
                msg:'Password incorrecto'
            })
        }

        //generar nuestro jason web token
        const token = await generateJWT(user.id, user.name);

        response.json({
            ok:true,
            uid:user.id,
            name:user.name,
            token

        })
        
    } catch (error) {
            console.log(error)
            response.status(500).json({
                ok:false,
                msg:'Por favor comuniquese con el administrador'
            })
    }

    
    
   
};

const revalidateToken = async(request, response = response) => {

    const {id,name} = request.body;
    

    //generar un jwt 
    const token = await generateJWT(id, name);

    
    response.json({
        ok:true,
        id,
        name,
        token

    })
}


module.exports = {
    createUser,
    loginUser,
    revalidateToken,
}






    // VALIDACION SIMPLE
    // if(name.length < 5 ) {
    //     return response.status(400).json({
    //         ok:false,
    //         msg:'el name no puede tener menos de 5 caracteres'
    //     })
    // }

    