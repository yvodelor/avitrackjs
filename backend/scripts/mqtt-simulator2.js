const mqtt = require("mqtt");



// Adresse de ton broker MQTT
const BROKER_URL = 'mqtt://localhost:1883'

// Topic sur lequel ton application écoute
const TOPIC = 'avitrack'

// Connexion au broker
const client = mqtt.connect(BROKER_URL, {
  clientId: `avitrack-simulator-${Date.now()}`
})

// Valeurs initiales
let temperature = 27
let humidity = 65
let ammonia = 10
let weight = 1.2

// Génère une petite variation aléatoire
function variation(value, amount) {
  return value + (Math.random() * 2 - 1) * amount
}

// Génère les données
function generateData() {
  temperature = variation(temperature, 0.5)
  humidity = variation(humidity, 1)
  ammonia = variation(ammonia, 1)
  weight += Math.random() * 0.02

  // Évite des valeurs absurdes
  temperature = Math.max(20, Math.min(35, temperature))
  humidity = Math.max(40, Math.min(90, humidity))
  ammonia = Math.max(0, Math.min(50, ammonia))

  return {
    deviceCode: 'ABCDEFGH002',

    t: Number(temperature.toFixed(2)),
    h: Number(humidity.toFixed(2)),
    a: Number(ammonia.toFixed(2)),
    p: Number(weight.toFixed(3))
  }
}

client.on('connect', () => {
  console.log('✅ Connecté au broker MQTT')
  console.log(`📡 Topic : ${TOPIC}`)

  // Envoie immédiatement une première mesure
  publishData()

  // Puis une mesure toutes les 50 secondes
  setInterval(publishData, 50000)
})

client.on('error', (error) => {
  console.error('❌ Erreur MQTT :', error.message)
})

function publishData() {
  const data = generateData()

  const message = JSON.stringify(data)

  client.publish(TOPIC, message, (error) => {
    if (error) {
      console.error('❌ Erreur publication :', error.message)
      return
    }

    console.log('📤 Données envoyées :')
    console.log(data)
  })
}
