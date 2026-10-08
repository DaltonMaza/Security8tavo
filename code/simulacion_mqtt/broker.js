require('dotenv').config();

const net = require('net');
const { Aedes } = require('aedes');

const HOST = process.env.MQTT_HOST || '0.0.0.0';
const PORT = Number(process.env.MQTT_PORT) || 1883;
const USERNAME = process.env.MQTT_USERNAME || '';
const PASSWORD = process.env.MQTT_PASSWORD || '';

let server;
let broker;

const start = async () => {
  broker = await Aedes.createBroker();

  if (USERNAME) {
    broker.authenticate = (client, username, password, callback) => {
      const ok =
        username === USERNAME &&
        password &&
        password.toString() === PASSWORD;

      if (ok) {
        return callback(null, true);
      }

      const error = new Error('Credenciales MQTT invalidas');
      error.returnCode = 4;
      return callback(error, false);
    };
  }

  server = net.createServer(broker.handle);

  broker.on('client', (client) => {
    console.log(`[broker] Cliente conectado: ${client.id}`);
  });

  broker.on('clientDisconnect', (client) => {
    console.log(`[broker] Cliente desconectado: ${client.id}`);
  });

  broker.on('subscribe', (subscriptions, client) => {
    const topics = subscriptions.map((s) => s.topic).join(', ');
    console.log(`[broker] ${client.id} se suscribio a: ${topics}`);
  });

  broker.on('unsubscribe', (subscriptions, client) => {
    console.log(`[broker] ${client.id} se desuscribio de: ${subscriptions.join(', ')}`);
  });

  broker.on('publish', (packet, client) => {
    if (!client) return;
    console.log(`[broker] ${client.id} publico en "${packet.topic}": ${packet.payload.toString()}`);
  });

  broker.on('clientError', (client, err) => {
    console.error('[broker] Error de cliente:', err.message);
  });

  server.listen(PORT, HOST, () => {
    console.log(`[broker] Servidor MQTT escuchando en mqtt://${HOST}:${PORT}`);
    if (USERNAME) {
      console.log(`[broker] Autenticacion requerida para el usuario "${USERNAME}"`);
    } else {
      console.log('[broker] Autenticacion deshabilitada (acceso anonimo)');
    }
  });
};

const shutdown = () => {
  console.log('\n[broker] Cerrando servidor MQTT...');
  if (server) {
    server.close(() => broker && broker.close(() => process.exit(0)));
  }
  setTimeout(() => process.exit(0), 2000).unref();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = start();
