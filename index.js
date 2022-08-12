const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on('error', (error) => console.log(`Error en servidor ${error}`));
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));

//Configuracion del motor
app.set('view engine', 'hbs'); //configuro el motor hbs
app.set('views', './views'); //donde voy a poner mis vistas, en la carpeta views
//como dejo configurado el motor
app.engine(
  'hbs',
  engine({
    //objeto de configuracion del motor
    extname: '.hbs',
    defaultLayout: 'index.hbs', //layout principal
    layoutsDir: __dirname + '/views/layouts', //carpeta de layout
    partialsDir: __dirname + '/views/partials',// carpeta de partials
  })
);
//Fin de configuracion del motor

let productsHC = [
  { id: 1, title: 'nike ball', price: 101, thumbnail: 'http://localhost:8080/public/nike-ball.jpg' },
  { id: 2, title: 'nike shoes', price: 102, thumbnail: 'http://localhost:8080/public/nike-shoes.jpg' },
  { id: 3, title: 'adidas shoes', price: 102, thumbnail: 'http://localhost:8080/public/adidas-shoes.jpg' },
];

app.get('/products', (req, res) => {
  //sirve productslist.hbs en index.hbs (index.hbs es la plantilla por defecto donde arranca todo)
  //ACA LA PAGINA ESTA ARMADA  EN BACK
  res.render('productslist', { products: productsHC, productsExist: true });
});

app.get('/products/:id', (req, res) => {
  const { id } = req.params
  try {
    let productoEncontrado =  productsHC.find(e => e.id == id);
    
    if(productoEncontrado){
    res.render('product', {producto: productoEncontrado, title: 'Detalle del producto'})
    } else {
      res.render('noProduct')
    }
  } catch (error) {
    res.json({error});
  }
})

app.get('/form', (req, res) => {
  res.render('formulario');
});

app.post('/form', (req, res) => {
  const { body } = req;

  const indice = productsHC.map(elem => elem.id).sort();
  id = indice[indice.length - 1] + 1 
  
  const productoAgregar = {...body, id}

  productsHC.push(productoAgregar);
  res.render('productoNuevo', { productoNuevo: productoAgregar, title:'Nuevo producto agregado'});
});