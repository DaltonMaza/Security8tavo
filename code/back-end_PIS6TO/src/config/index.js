require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    url: process.env.DB_URL,
  },
  jwt: process.env.JWT_SECRET,
  frontUrl: process.env.FRONT_URL || "http://localhost:3000",
  mqttBrokerUrl: process.env.MQTT_BROKER_URL || "mqtt://localhost:1883"
};