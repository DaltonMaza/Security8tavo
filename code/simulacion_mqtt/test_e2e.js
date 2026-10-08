process.env.MQTT_HOST = '127.0.0.1';
process.env.MQTT_BROKER_URL = 'mqtt://127.0.0.1:1883';
process.env.SENSOR_INTERVAL_MS = '1000';

require('./broker');

const mqtt = require('mqtt');
const recibidos = {};

setTimeout(() => {
  const backend = mqtt.connect('mqtt://127.0.0.1:1883', { clientId: 'backend-test' });

  backend.on('connect', () => {
    console.log('[test] backend conectado');
    backend.subscribe(['sensor/temperatura', 'sensor/humedad', 'sensor/co2']);
  });

  backend.on('message', (topic, message) => {
    recibidos[topic] = message.toString();
    console.log(`[test] backend recibio ${topic}=${message.toString()}`);

    if (Object.keys(recibidos).length === 3) {
      console.log('[test] OK: backend recibio temperatura, humedad y co2');
      process.exit(0);
    }
  });

  require('./emulador_placa');
}, 500);

setTimeout(() => {
  console.error('[test] FALLO: no se recibieron todos los datos');
  process.exit(1);
}, 15000);
