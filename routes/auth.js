// Rutas de usuarios / Auth
// host + /api/auth


const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { validateFields } = require('../middlewares/fieldValidators');
const {validateJWT} = require('../middlewares/validate-JWT');

const { createUser, loginUser, revalidateToken } = require('../controllers/auth');

router.post(
    '/new', 
    [//middlewares
        check('name', 'El nombre es obligatorio').notEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser minimo 6 caracteres').isLength({min:6}),
        validateFields

    ],
    createUser );

router.post(
    '/', 
    [//middlewares
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser minimo 6 caracteres').isLength({min:6}),
        validateFields
    ],
    loginUser);



router.get('/renew', validateJWT, revalidateToken);




module.exports = router;