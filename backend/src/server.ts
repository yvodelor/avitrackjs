import app from "./app";
import http from "http";
import { Server } from "socket.io";
import { mqttClient } from "./config/mqtt";
import { MQTTService } from "./services/mqtt.service";
import { initSocket } from "./config/socket";




const server = http.createServer(app);




initSocket(server);


// MQTT écoute les données
MQTTService.subscribe('avitrack')
MQTTService.listen()


server.listen(3000,()=>{

    console.log(
        "API + Websocket port 3000"
    );

});