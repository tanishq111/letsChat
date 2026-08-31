```
Request
  │
  ▼
cors()  ──▶ express.json() ──▶ logger ──▶ matching route/controller
                                              │
                        ┌─────────────────────┴───────────────┐
                        │                                      │
                 (no route matched)                    (controller throws)
                        │                                      │
                        ▼                                      ▼
                  404 handler                        error handler (4 args)
                        │                                      │
                        ▼                                      ▼
                     Response                              Response
```





```
WITHOUT SALT                          WITH SALT
────────────                          ─────────
hash("password123") = 9x8f...         hash("password123" + "aB3$") = 4kd9wrruheiruheiruheiurheiurheiuhqnwqjhqjuwh
hash("password123") = 9x8f...         hash("password123" + "Zq7!") = p0w2wiehuweyhwyuehuwyerhuwyhuyrwuyerhuwrjuwh
   ↑ identical → crackable               ↑ different every time → safe
```







                     
```
      SQL (e.g. MySQL)            MongoDB
      ─────────────────          ─────────────────
      Database                   Database
        └─ Table                   └─ Collection
             └─ Row                     └─ Document (a JSON-like object)
                  └─ Column                  └─ Field
```




```
user collection
user
{
    username : something
    password:
    email:
}

 {
    user_name:
    password:
    email:
 }
```




```
┌──────────┐        participants[]         ┌───────────────┐
│   User   │◀──────────────────────────────│ Conversation  │
│  _id     │                               │  _id          │
│ username │        sender                 │ participants[]│
│ email    │◀───────────────┐              │ lastMessage ──┼──┐
│ password │                │              └───────┬───────┘  │
└──────────┘                │                      │          │
                            │            conversation         │
                       ┌────┴─────┐◀─────────────────┘        │
                       │ Message  │◀──────────────────────────┘
                       │  _id     │
                       │  text    │
                       │  status  │
                       └──────────┘
```



How the token works


```
1. Login (email+password)  ──────────▶  Server verifies, SIGNS a token
2. Server sends token back  ◀──────────
3. Every later request carries the token ──▶ Server VERIFIES it → "yep, it's Aisha"
```



JWT Token

```
   header  .  payload  .  signature
   eyJhbG  .  eyJpZCI  .  SflKxwRJ...
```

Draw and explain each part:

```
┌─────────────────────────────────────────────────────────┐
│ HEADER    { "alg": "HS256", "typ": "JWT" }                │  which algorithm
├─────────────────────────────────────────────────────────┤
│ PAYLOAD   { "id": "665f...", "iat": ..., "exp": ... }     │  the CLAIMS (data)
├─────────────────────────────────────────────────────────┤
│ SIGNATURE HMAC( header + payload , SECRET )               │  the tamper-proof seal
└─────────────────────────────────────────────────────────┘
```




```
signature = HMAC_SHA256(
    base64url(header) + "." + base64url(payload),
    JWT_SECRET
)

full token = base64url(header) . base64url(payload) . base64url(signature)
```




```
Request ─▶ [ authMiddleware ] ─▶ controller
              │ valid token?
              ├─ yes → attach req.user, next()
              └─ no  → 401, stop here
```



Prop Drilling


         App (has user data)
           │
       ┌───┴────┐
    Navbar    ChatPage
                │
           ┌───┴────┐
        Sidebar   MessageList
                      │
                   MessageItem ← needs user data too


```
App stored some data in to context
all the components that are consuming the value from the context -> will be re rendered if context gets updated
```


```
emit -> sends an event -> socket.emit("typing", ()=>{print})
on -> listens an event -> socket.on("typing",())
```



```
  ALICE'S BROWSER            SERVER (Node + Socket.io)            BOB'S BROWSER
  ───────────────            ────────────────────────            ─────────────
  type "hey" + send
        │  emit "message:send"
        └───────────────────────►  
                                   on "message:send":
                    
                                     • emit "message:new" to
                                       room aliceId AND room bobId
                    ┌──────────────────────┴───────────────────────┐
     on "message:new"                                         on "message:new"
        │                                                          │
     bubble appears (Alice)                              bubble appears (Bob)
        └── no refresh ──┘                                └── no refresh ──┘
```




```
The connection lifecycle (memorize the order):

  1. client calls io(url, { auth: { token } })     ← dial
  2. io.use((socket, next) => …)                    ← the bouncer checks ID (ONCE)
        next()            → allowed  ───┐
        next(new Error()) → rejected    │  (client gets "connect_error")
  3. io.on("connection", socket => …)   ←─┘ you're IN; socket.userId is set
  4. socket.on("message:send", …)        ← now events flow freely, no re-check
  5. socket.on("disconnect", …)          ← line closed (tab closed, WiFi died…)
```



```
room "aliceId" -> [alice laptio sockt] 
room "bobId" -> [bob laptio sockt, bob mobile socketV] 


io.to(bobId).emit("messageN",msg) -> this will deliver the message to both bob's devics
```



````
4 ways to send a message
socket.emit('x',d) ->  only for one
io.to(roomId).emit('x',d) -> everyone in that room
socket.broadcast.emit('x',d) -> everyone except the sender -> (someone is typing)
io.emit('x',d) -> absolutely everyone 
````




```
ALICE (browser)                 SERVER (io)                        BOB (browser)
──────────────                  ───────────                        ────────────
types "hi", hits send
  │
  │  sendMessage(text)
  │  socket.emit("message:send",
  │     { conversationId, text })
  ├───────────────────────────────►  message:send handler:
                                      1. validate conversationId + text
                                      2. Conversation.findById(...)
                                      3. check sender is a participant
                                      4. new Message(...).save()   ← saved to MongoDB
                                      5. conversation.lastMessage = message._id; save()
                                      6. for each participant:
                                         io.to(participantId).emit("message:new", message)
                                          │                              │
                     message:new ◄───────┘                              │
        (Alice is a participant too,                                    │
         so she gets the echo)                          message:new ◄───┘
  │                                                          │
  ▼                                                          ▼
handleNewMessage(message)                          handleNewMessage(message)
  → append to open thread (if this chat is open)     → append to open thread (if open)
  → update sidebar preview + float to top            → update sidebar preview + float to top
```