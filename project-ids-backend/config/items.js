const router = require('express').Router();

const { Item, random, Op, team } = require('../../databases/db');

const controllerFile = require('../../controller/upload');
const controllerItem = require('../../controller/uploadItems')

//endpoint para listar cromos
router.get('/', async (req,res)=>{  
    //paginacion
    const {page = 0, size = 10} = req.query;

    let options = {
        limit: +size,
        offset: (+page) * (+size)
    };
    const items = await Item.findAndCountAll({
      options,
      attributes: ['id','playerName', 'country', 'position', 'img', 'height', 'weight', 'appearanceRate', 'createdAt', 'updatedAt'],
      include: {
        model: team,
        attributes: ['id', 'name', 'badge']
      }
    });
    res.status(200).json({message: 'Lista de cromos', items});
});

//endpoint para obtener 5 cromos al azar
router.get('/obtain', async (req, res) => {
  if (await Item.findOne()) {
    const items = [];
    let appearanceRate = 0;
    let singleItem;
    do {
      do {
        appearanceRate = Math.random()*100;
        singleItem = await Item.findOne({
          order: random,
          attributes: ['id','playerName', 'country', 'position', 'img', 'height', 'weight', 'appearanceRate', 'createdAt', 'updatedAt'],
          include : {
            model: team,
            as: 'team',
            attributes: ['name', 'badge']
          },
          where: {
            appearanceRate: {
              [Op.gte]: appearanceRate
            }
          }
        });
      } while (!singleItem)

      items.push(singleItem);

    } while (items.length < 5)
    res.status(200).json({
      "success": true,
      "items": items
    });
  } else {
    console.error('NO ITEMS IN DB AAAAAAAAAAAAAAAAAAAAAH');
    res.status(500).send('Servicio en mantenimiento...');
  }
});

//endpoint para crear cromos
router.post('/', controllerFile.upload, controllerItem.uploadFileItem);

//endpoint para editar cromos
router.put('/:playerId', controllerFile.upload, controllerItem.uploadUpdatedFileItem);

//endpoint para borrar cromos
router.delete('/:playerId', async (req,res)=>{
    await Item.destroy({
        where:{ id: req.params.playerId }
    });
    res.json({ success:'Se ha eliminado'});
});


module.exports = router;