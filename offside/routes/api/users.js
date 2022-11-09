const router = require('express').Router(); 
const bcrypt = require('bcryptjs');         
const moment = require('moment');
const jwt = require('jwt-simple');

const { User }= require('../../dataBase'); 
const { check, validationResult}=require('express-validator'); 

//endpoint para registrar usuarios

router.post('/register',[
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('password','El password es obligatorio').not().isEmpty(),
    check('email','El email debe ser correcto').isEmail()
],async(req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errores:errors.array()})
    }

    req.body.password = bcrypt.hashSync(req.body.password,10);
    const user = await User.create(req.body);
    res.json(user);
});

//endpoint para crear usuarios
router.post('/', async (req,res)=>{
    const user = await User.create(req.body);
    res.json(user);
});

//endpoint de login

router.post('/login', async (req,res)=>{
    const user= await User.findOne({where:{email:req.body.email}});
    if(user){
        const iguales= bcrypt.compareSync(req.body.password, user.password);
        if(iguales){
            res.json({success:createToken(user)});
        }else{
            res.json({error:'Error en usuario y/o contraseña'}); 
        }
    }else{
        res.json({error:'Error en usuario y/o contraseña'});
    }
});

//endpoint para listar usuarios
router.get('/', async (req,res)=>{
    const users = await User.findAll();
    res.json(users);
});


//endpoint para editar usuarios
router.put('/:userId', async (req,res)=>{
    await User.update(req.body,{
        where:{ id: req.params.userId}
    });
    res.json({ success:'Se ha modificado'});
});

//endpoint para borrar usuarios
router.delete('/:userId', async (req,res)=>{
    await User.destroy({
        where:{ id: req.params.userId}
    });
    res.json({ success:'Se ha eliminado'});
});

const createToken=(user)=>{
    const payload ={
        usuarioId: user.id,
        createdAt:moment().unix(),
        expiredAt: moment().add(5,'minutes').unix()
    }
    return jwt.encode(payload,'frase secreta');
}

module.exports = router;