const router= require('express').Router();

const { Event }= require('../../databases/db');

//endpoint para listar eventos
router.get('/', async (req,res)=>{
    //paginacion
    const {page = 0, size = 10} = req.query;

    let options = {
        limit: +size,
        offset: (+page) * (+size)
    };
    const events = await Event.findAndCountAll(options);
    res.status(200).json({success: true,"events": events });
});

////endpoint para listar eventos activos
router.get('/status', async (req,res)=>{
    const eventsAvailable= await Event.findAll({where:{"status":true}});
     if(eventsAvailable==''){
        res.json({error:'No existen eventos disponibles'});
    }else{
        res.status(200).json({success: true,"events available": eventsAvailable });
    }

});

//endpoint para crear eventos
router.post('/', async (req,res)=>{
    const event = await Event.create(req.body);
    res.json({message:'Evento creado', event });
});

//endpoint para editar eventos
router.put('/:eventId', async (req,res)=>{
    await Event.update(req.body,{
        where:{ id: req.params.eventId}
    });
    res.json({ success:true,message:"Modificación exitosa"});
});

//endpoint para borrar eventos
router.delete('/:eventId', async (req,res)=>{
    await Event.destroy({
        where:{ id: req.params.eventId}
    });
    res.json({ success:true,message:"Eliminación exitosa"});
});


module.exports=router;