// hacer el import de express tradicional
// const express = require('express');

// hacer el nuevo import
import Express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import Cors from 'cors';

import jwt from 'express-jwt'
import jwks from 'jwks-rsa';
import jwksRsa from 'jwks-rsa';

const stringConexion = 'mongodb+srv://technologywarfare:technologywarfare@cluster0.ngzup.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const client = new MongoClient(stringConexion, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let baseDeDatos;

const app = Express();

app.use(Express.json());
app.use(Cors());

export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://technowarfare.us.auth0.com/.well-known/jwks.json'
}),
audience: 'api-autenticaion-technowarfare',
issuer: 'https://technowarfare.us.auth0.com/',
algorithms: ['RS256']
});

app.get('/dashboard', function (req, res){
  res.send('Secured resource');
});

app.use(checkJwt);


//crud usuarios
app.get('/usuarios', checkJwt, (req, res) => {
  console.log('alguien hizo get en la ruta /usuarios');
  baseDeDatos
    .collection('usuario')
    .find()
    .limit(50)
    .toArray((err, result) => {
      if (err) {
        res.status(500).send('Error consultando los usuarios');
      } else {
        res.json(result);
      }
    });
});

app.post('/usuarios/nuevo', (req, res) => {
  console.log(req);
  const datosUsuario = req.body;
  console.log('llaves: ', Object.keys(datosUsuario));
  try {
    if (
      Object.keys(datosUsuario).includes('nombre') &&
      Object.keys(datosUsuario).includes('apellido') &&
      Object.keys(datosUsuario).includes('edad') &&
      Object.keys(datosUsuario).includes('email') &&
      Object.keys(datosUsuario).includes('documento') &&
      Object.keys(datosUsuario).includes('numerodocumento') &&
      Object.keys(datosUsuario).includes('cargo') 
    ) {
      // implementar código para crear vehículo en la BD
      baseDeDatos.collection('usuario').insertOne(datosUsuario, (err, result) => {
        if (err) {
          console.error(err);
          res.sendStatus(500);
        } else {
          console.log(result);
          res.sendStatus(200);
        }
      });
    } else {
      res.sendStatus(500);
    }
  } catch {
    res.sendStatus(500);
  }
});

app.patch('/usuarios/editar', (req, res) => {
  const edicion = req.body;
  console.log(edicion);
  const filtroUsuario = { _id: new ObjectId(edicion.id) };
  delete edicion.id;
  const operacion = {
    $set: edicion,
  };
  baseDeDatos
    .collection('usuario')
    .findOneAndUpdate(
      filtroUsuario,
      operacion,
      { upsert: true, returnOriginal: true },
      (err, result) => {
        if (err) {
          console.error('error actualizando el usuario: ', err);
          res.sendStatus(500);
        } else {
          console.log('actualizado con exito');
          res.sendStatus(200);
        }
      }
    );
});

app.delete('/usuarios/eliminar', (req, res) => {
  const filtroUsuario = { _id: new ObjectId(req.body.id) };
  baseDeDatos.collection('usuario').deleteOne(filtroUsuario, (err, result) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});



//*******************-----------------******************
//crud vehiculos
app.get('/vehiculos', (req, res) => {
  console.log('alguien hizo get en la ruta /vehiculos');
  baseDeDatos
    .collection('vehiculo')
    .find()
    .limit(50)
    .toArray((err, result) => {
      if (err) {
        res.status(500).send('Error consultando los usuarios');
      } else {
        res.json(result);
      }
    });
});

app.post('/vehiculos/nuevo', (req, res) => {
  console.log(req);
  const datosVehiculo = req.body;
  console.log('llaves: ', Object.keys(datosVehiculo));
  try {
    if (
      Object.keys(datosVehiculo).includes('marca') &&
      Object.keys(datosVehiculo).includes('modelo') &&
      Object.keys(datosVehiculo).includes('generacion') &&
      Object.keys(datosVehiculo).includes('serie') && 
      Object.keys(datosVehiculo).includes('modificacion') &&
      Object.keys(datosVehiculo).includes('equipamiento') &&
      Object.keys(datosVehiculo).includes('descripcion') &&
      Object.keys(datosVehiculo).includes('observaciones') 
      ) {
        // implementar código para crear vehículo en la BD
        baseDeDatos.collection('vehiculo').insertOne(datosVehiculo, (err, result) => {
          if (err) {
            console.error(err);
            res.sendStatus(500);
          } else {
            console.log(result);
            res.sendStatus(200);
          }
        });
      } else {
        res.sendStatus(500);
      }
    } catch {
      res.sendStatus(500);
    }
  });

app.patch('/vehiculos/editar', (req, res) => {
  const regVehiculo = req.body;
  console.log(regVehiculo);
  const filtroVehiculo = { _id: new ObjectId(regVehiculo.id) };
  delete regVehiculo.id;
  const operacion = {
    $set: regVehiculo,
  };
  baseDeDatos
    .collection('vehiculo')
    .findOneAndUpdate(
      filtroVehiculo,
      operacion,
      { upsert: true, returnOriginal: true },
      (err, result) => {
        if (err) {
          console.error('error actualizando el vehiculo: ', err);
          res.sendStatus(500);
        } else {
          console.log('actualizado con exito');
          res.sendStatus(200);
        }
      }
    );
});

app.delete('/vehiculos/eliminar', (req, res) => {
  const filtroVehiculo = { _id: new ObjectId(req.body.id) };
  baseDeDatos.collection('vehiculo').deleteOne(filtroVehiculo, (err, result) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});



//*******************-----------------******************
//crud ventas
app.get('/ventas', (req, res) => {
  console.log('alguien hizo get en la ruta /ventas');
  baseDeDatos
    .collection('venta')
    .find()
    .limit(50)
    .toArray((err, result) => {
      if (err) {
        res.status(500).send('Error consultando las ventas');
      } else {
        res.json(result);
      }
    });
});

app.post('/ventas/nuevo', (req, res) => {
  console.log(req);
  const datosVenta = req.body;
  console.log('llaves: ', Object.keys(datosVenta));
  try {
    if (
      Object.keys(datosVenta).includes('idVenta') &&
      Object.keys(datosVenta).includes('idAuto') &&
      Object.keys(datosVenta).includes('firstName') &&
      Object.keys(datosVenta).includes('lastName') && 
      Object.keys(datosVenta).includes('email') &&
      Object.keys(datosVenta).includes('celular') &&
      Object.keys(datosVenta).includes('fNVendedor') &&
      Object.keys(datosVenta).includes('lNVendedor') && 
      Object.keys(datosVenta).includes('emailVendedor') &&
      Object.keys(datosVenta).includes('celularVendedor') && 
      Object.keys(datosVenta).includes('precio') &&
      Object.keys(datosVenta).includes('estado') && 
      Object.keys(datosVenta).includes('cantidad') &&
      Object.keys(datosVenta).includes('descripcion') &&
      Object.keys(datosVenta).includes('observacion')  
      ) {
        // implementar código para crear vehículo en la BD
        baseDeDatos.collection('venta').insertOne(datosVenta, (err, result) => {
          if (err) {
            console.error(err);
            res.sendStatus(500);
          } else {
            console.log(result);
            res.sendStatus(200);
          }
        });
      } else {
        res.sendStatus(500);
      }
    } catch {
      res.sendStatus(500);
    }
  });

app.patch('/ventas/editar', (req, res) => {
  const regVenta = req.body;
  console.log(regVenta);
  const filtroVenta = { _id: new ObjectId(regVenta.id) };
  delete regVenta.id;
  const operacion = {
    $set: regVenta,
  };
  baseDeDatos
    .collection('venta')
    .findOneAndUpdate(
      filtroVenta,
      operacion,
      { upsert: true, returnOriginal: true },
      (err, result) => {
        if (err) {
          console.error('error actualizando la venta: ', err);
          res.sendStatus(500);
        } else {
          console.log('actualizado con exito');
          res.sendStatus(200);
        }
      }
    );
});

app.delete('/ventas/eliminar', (req, res) => {
  const filtroVenta = { _id: new ObjectId(req.body.id) };
  baseDeDatos.collection('venta').deleteOne(filtroVenta, (err, result) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

const main = () => {
  client.connect((err, db) => {
    if (err) {
      console.error('Error conectando a la base de datos');
      return 'error';
    }
    baseDeDatos = db.db('tesla');
    console.log('baseDeDatos exitosa');
    return app.listen(5000, () => {
      console.log('escuchando puerto 5000');
    });
  });
};

main();
