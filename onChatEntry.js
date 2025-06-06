import WebSocket from "ws";
import { WebSocketServer } from "ws";
import { createClient } from 'redis';

const wss = new WebSocketServer({ port: 8080 });

const client = createClient({
    url: 'redis://localhost:6379',
  });

client.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
  try {
    await client.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

(async () => {
    await connectRedis();
    
  }) ();

const users = new Map();

wss.on('connection' , (ws) => {

    let userId; 
        ws.on('message' ,async (message) => {
          try {
            const mes = JSON.parse(message);
            userId = mes['userId']
            users.set(mes['userId'], { ws, lastPong: Date.now()});
           

            if (mes && typeof mes === 'object' && mes.hasOwnProperty('content')) {

              const stra = JSON.stringify({
                content: mes.content,
                to: mes.to,
                isCurrentUser: false,
                from: mes.from,
                id: mes.id,
                time: mes.time
              })
              sendMessage(mes.to , stra)
            } else {
              switch (mes.type){
                case 'connect' :
                  console.log(mes.userId)
                    const items = await client.lRange(String(mes.userId), 0, -1); 
                    if (items.length > 0) {
                      items.forEach( async (data) => {
                          sendMessage(String(mes['userId']) , data)
                          const result = await client.lRem(String(mes['userId']), 0, data);
                          console.log(`Removed ${result} occurrence(s) of "${data}" from ${String(mes['userId'])}`);
                      });
                    }
                break;
                case 'message' :
                sendMessage(mes.userId , message.message)
                break;
                default:
            }           
           }
          } catch (error) {
              console.log(error);
          }
        })
        ws.on('close', () => {
          users.delete(userId);
              console.log(`User ${userId} disconnected`);
        });
    });
const sendMessage = async (username, message) => {
    if (!username || username.trim() === "") {
      console.error("Invalid username");
      return;
    }
  
    const userWebsocket = users.get(username);
    console.log("Looking for user:", username, "Found:", !!userWebsocket);
  
    if (userWebsocket && userWebsocket.ws) {
      if (userWebsocket.ws.readyState === WebSocket.OPEN) {
        userWebsocket.ws.send(message);
        console.log("Message sent");
      } else {
        console.log("WebSocket is not open, issues with ready state");
        await client.rPush(username, message);
       
      }
    } else {
      console.log(`No WebSocket found for user: ${username}`);
      await client.rPush(username, message);
      
    }
  };
  
  