require('dotenv').config();

const mqtt = require('mqtt');

const BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
const MQTT_USERNAME = process.env.MQTT_USERNAME || undefined;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD || undefined;

const INTERVAL_MS = Number(process.env.SENSOR_INTERVAL_MS) || 3000;

const TEMP_TOPIC = process.env.TEMP_TOPIC || 'sensor/temperatura';
const HUM_TOPIC = process.env.HUM_TOPIC || 'sensor/humedad';
const CO2_TOPIC = process.env.CO2_TOPIC || 'sensor/co2';
const CMD_TOPIC = process.env.CMD_TOPIC || 'placa/comandos';
const ACK_TOPIC = process.env.ACK_TOPIC || 'placa/ack';

const options = {
  clientId: 'ESP32Client',
  clean: true,
  reconnectPeriod: 5000,
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
};

const client = mqtt.connect(BROKER_URL, options);

let timer = null;

const randomAround = (base, delta, decimals = 2, min = -Infinity, max = Infinity) => {
  const value = base + (Math.random() * 2 - 1) * delta;
  const clamped = Math.min(max, Math.max(min, value));
  return Number(clamped.toFixed(decimals));
};

const leerDHT11 = () => ({
  temperatura: randomAround(23, 8, 2, -10, 50),
  humedad: randomAround(60, 25, 2, 0, 100),
});

const leerMQ135 = () => ({
  co2: randomAround(600, 900, 2, 400, 5000),
});

const publicarSensores = () => {
  const { temperatura, humedad } = leerDHT11();
  const { co2 } = leerMQ135();

  client.publish(TEMP_TOPIC, temperatura.toString(), { qos: 0 });
  client.publish(HUM_TOPIC, humedad.toString(), { qos: 0 });
  client.publish(CO2_TOPIC, co2.toString(), { qos: 0 });

  console.log(
    `[placa] Enviado -> ${TEMP_TOPIC}: ${temperatura} | ` +
    `${HUM_TOPIC}: ${humedad} | ${CO2_TOPIC}: ${co2}`
  );
};

client.on('connect', () => {
  console.log(`[placa] Conectada al broker MQTT en ${BROKER_URL}`);

  client.subscribe(CMD_TOPIC, { qos: 1 }, (err) => {
    if (err) {
      console.error(`[placa] Error al suscribirse a ${CMD_TOPIC}:`, err.message);
      return;
    }
    console.log(`[placa] Suscrita a comandos en: ${CMD_TOPIC}`);
  });

  timer = setInterval(publicarSensores, INTERVAL_MS);
  publicarSensores();
});

client.on('message', (topic, message) => {
  const payload = message.toString();
  console.log(`[placa] Comando recibido en ${topic}: ${payload}`);

  let comando;
  try {
    comando = JSON.parse(payload);
  } catch (e) {
    comando = { accion: payload };
  }

  const respuesta = {
    dispositivo: 'ESP32Client',
    comando: comando.accion || comando.command || comando,
    estado: 'EJECUTADO',
    timestamp: new Date().toISOString(),
  };

  client.publish(ACK_TOPIC, JSON.stringify(respuesta), { qos: 1 });
  console.log(`[placa] ACK enviado en ${ACK_TOPIC}: ${JSON.stringify(respuesta)}`);
});

client.on('reconnect', () => {
  console.log('[placa] Reconectando al broker MQTT...');
});

client.on('error', (err) => {
  console.error('[placa] Error de MQTT:', err.message);
});

const shutdown = () => {
  console.log('\n[placa] Deteniendo emulador...');
  if (timer) clearInterval(timer);
  try {
    client.end(true);
  } catch (e) {
    // ignorar
  }
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
