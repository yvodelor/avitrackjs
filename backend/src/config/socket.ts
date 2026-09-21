import { Server } from "socket.io";
import http from "http";

export let io: Server;

export function initSocket(server: http.Server) {

  const FONTEND_URL = process.env.FRONTEND_URL;

  io = new Server(server, {
    cors: {
      origin: FONTEND_URL,
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
