# cinemaServer
```
headers: [
  "Content-Type": "application/json",
  "X-App-Token: "ulknfao[b81jbAdaio15Ha...fhio1"
]
```
<b>Запрос на добавление пользователя:</b>
```
POST /v1/sighup
```
```
{
  "name": "vlad",
  "email": "vlad@test.ru",
  "password": "123456",
  "city": "Винница"
}
```
<i>Ответ:</i>
```
{
  "success": "true",
  "message": "User has been added"
}
```

<b>Запрос на вход:</b>
```
POST /v1/signin
```
```
{
  "email": "vlad@test.ru",
  "password": "123456"
}
```
<i>Ответ:</i>
```
{
  "success": "true",
  "message": "User has entered",
  "email": "vlad@test.ru", // if success
  "token": "ulknfao[b81jbAdaio15Ha...fhio1" // if success
}
```

<b>Запрос на получение данных пользователя:</b>
```
GET /v1/getuserdata
```
```
{
  "email": "vlad@test.ru"
}
```
```
+ headers
```
<i>Ответ:</i>
```
{
  "name": "vlad",
  "email": "vlad@test.ru",
  "city": "Винница"
}
```

<b>Запрос на получение кинотеатров:</b>
```
GET /v1/cinemas
```
```
{
  "city": "Винница",
  "formats": [
    "2d",
    "3d"
  ]
}
```
```
+ headers
```
<i>Ответ:</i>
```
[
  {
    "name": "Smart Cinema",
    "address": "Соборна 13",
    "formats": [
      "2d",
      "3d"
    ]
  },
  {
    "name": "Мир",
    "address": "Келецкая 112",
    "formats": [
      "2d",
      "3d"
    ]
  }
]
```

<b>Запрос на получение фильмов:</b>
```
GET /v1/films
```
```
{
  "cinema": "12", // id
  "genres": [
    "horror",
    "action"
  ]
}
```
```
+ headers
```
<i>Ответ:</i>
```
[
  {
    "name": "Мы",
    "genres": [
      "horror"
    ],
    "duration": "95",
    "formats": [
      "2d"
    ]
  },
  {
    "name": "Дамбо",
    "genre": [
      "action"
    ],
    "duration": "103",
    "formats": [
      "2d",
      "3d"
    ]
  }
]
```
