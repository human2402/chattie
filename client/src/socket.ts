import { io, Socket  } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL: string | undefined = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';


let socket: Socket | null = null;

export function createSocket(userID, serverOffset,): Socket {

    // const user = JSON.parse(localStorage.getItem("user") || "{}");
    // console.log(user.id,)
    socket = io(URL, {
        // auth: {
        //     // userID: userID,
        //     userID: user.id,
        //     serverOffset,
        // },
        autoConnect: false, // should be true by default
        reconnection: true, // must be enabled
        reconnectionAttempts: Infinity, // or a reasonable number
        reconnectionDelay: 1000,
      });
    

    return socket;
}