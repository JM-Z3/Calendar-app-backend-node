const { Router } = require("express");
const { validateJWT } = require('../middlewares/validate-JWT');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const {check} = require('express-validator');
const {validateFields} = require('../middlewares/fieldValidators');
const {isDate} = require('../helpers/isDate');
const router = Router();

// Event Routes /api/events

//todas tienen que pasar por la validacion del token
router.use(validateJWT);
//obtener eventos
router.get('/', getEventos);


router.post(
    '/',
    [
        check('title','el titulo es obligatorio').not().isEmpty(),
        check('start', 'la fecha de inicio es necesaria').custom( isDate ),
        check('end', 'la fecha de fin es necesaria').custom( isDate ),

        validateFields,

    ],
     crearEvento);


router.put('/:id', actualizarEvento );


router.delete('/:id', eliminarEvento);


module.exports = router;