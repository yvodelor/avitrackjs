import { Server } from "socket.io";
import http from "http";

export let io: Server;

export function initSocket(server: http.Server) {

  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {

    console.log(
      " Client connecté :",
      socket.id
    );

    // Le frontend rejoint un bâtiment
    socket.on("join-device", (deviceId) => {

      const room = `device-${deviceId}`;

      socket.join(room);

      console.log(
        ` Client ${socket.id} rejoint ${room}`
      );

    });

    // Client déconnecté
    socket.on("disconnect", () => {

      console.log(
        " Client déconnecté :",
        socket.id
      );

    });

  });

}
