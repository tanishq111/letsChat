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