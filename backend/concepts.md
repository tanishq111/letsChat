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


