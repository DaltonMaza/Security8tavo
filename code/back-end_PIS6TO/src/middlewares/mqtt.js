require('dotenv').config();

const mqtt = require('mqtt');
const mongoose = require('mongoose');
const Node = require('../models/Node');
const dataController = require('../controllers/datosController');
const weatherStateService = require('../services/weatherStateService');

const mqttBrokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';

const mqttOptions = {
  clientId: `backend-${Math.random().toString(16).slice(2, 10)}`,
  username: process.env.MQTT_USERNAME || undefined,
  password: process.env.MQTT_PASSWORD || undefined,
};

// Topics que publica la placa (ver Pis_6to.ino)
const topicTemperatura = 'sensor/temperatura';
const topicHumedad = 'sensor/humedad';
const topicCo2 = 'sensor/co2';
const topicsSensores = [topicTemperatura, topicHumedad, topicCo2];

// Topics de datos consolidados en formato JSON
const topicDatos = 'datos/POST';
const topicConf = 'conf/POST';

// Buffer de lecturas por fuente hasta completar temperatura + humedad + co2
const buffer = {};

const parseNumber = (raw) => {
  const value = parseFloat(raw);
  return Number.isNaN(value) ? null : value;
};

const fieldByTopic = {
  [topicTemperatura]: 'temperatura',
  [topicHumedad]: 'humedad',
  [topicCo2]: 'co2',
};

const guardarLectura = async (data) => {
  if (!data.external_id) {
    data.external_id = new mongoose.Types.ObjectId().toString();
  }

  const result = await dataController.createData(data);
  const resultState = await weatherStateService.createState(
    data.temperatura,
    data.humedad,
    data.co2
  );

  console.log('Datos guardados exitosamente:', result);
  console.log('Estado climatico registrado:', resultState.state);

  return result;
};

const flushSensorBuffer = async (source) => {
  const lectura = buffer[source];
  if (!lectura) return;

  const { temperatura, humedad, co2 } = lectura;
  if (temperatura == null || humedad == null || co2 == null) return;

  const data = {
    temperatura,
    humedad,
    co2,
    timestamp: lectura.timestamp,
  };

  delete buffer[source];

  try {
    await guardarLectura(data);
  } catch (error) {
    console.error('Error al guardar la lectura agregada:', error);
  }
};

const mqttClient = mqtt.connect(mqttBrokerUrl, mqttOptions);

mqttClient.on('connect', () => {
  console.log(`Conectado al broker MQTT en ${mqttBrokerUrl}`);

  const topics = [...topicsSensores, topicDatos, topicConf];

  mqttClient.subscribe(topics, (err, granted) => {
    if (err) {
      console.error('Error al suscribirse a los canales:', err);
      return;
    }
    granted.forEach((sub) => console.log(`Suscrito al canal: ${sub.topic}`));
  });
});

mqttClient.on('message', async (topic, message) => {
  const raw = message.toString();
  console.log(`Mensaje recibido en el canal ${topic}: ${raw}`);

  try {
    if (topicsSensores.includes(topic)) {
      const field = fieldByTopic[topic];
      const value = parseNumber(raw);

      if (value == null) {
        console.error(`Valor invalido en ${topic}: ${raw}`);
        return;
      }

      const source = 'placa';
      buffer[source] = buffer[source] || {};
      buffer[source][field] = value;
      buffer[source].timestamp = new Date().toISOString();

      await flushSensorBuffer(source);
      return;
    }

    const data = JSON.parse(raw);

    if (topic === topicDatos) {
      await guardarLectura(data);
    } else if (topic === topicConf) {
      const { nodeId, ip } = data;
      const result = await Node.findByIdAndUpdate(nodeId, { ip }, { new: true });
      console.log('IP del nodo actualizada correctamente:', result);
    }
  } catch (error) {
    console.error('Error al procesar o guardar el mensaje:', error);
  }
});

mqttClient.on('error', (err) => {
  console.error('Error de conexion MQTT:', err.message);
});

mqttClient.on('reconnect', () => {
  console.log('Reconectando al broker MQTT...');
});

module.exports = mqttClient;
