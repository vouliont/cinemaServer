# cinemaServer
```
headers: [
  "Content-Type": "application/json",
  "X-App-Token: "ulknfao[b81jbAdaio15Ha...fhio1"
]
```
<br></br>
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
<br></br>
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
  "token": "ulknfao[b81jbAdaio15Ha...fhio1" // if success
}
```
<br></br>
<b>Запрос на получение данных пользователя:</b>
```
GET /v1/getuserdata
```
```
headers
```
<i>Ответ:</i>
```
{
  "success": "true",
  "name": "vlad",
  "city": "Винница",
  "accessLevel": "0"
}
```
<br></br>
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
  "success": true,
  "cinemas": [
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
]
```
<br></br>
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
  ],
  "partOfDay": "morning" // can be null, if null then get films for all day
}
```
```
+ headers
```
<i>Ответ:</i>
```
[
  "success": "true",
  "films": [
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
]
```
<br></br>
<b>Запрос на получение сеансов:</b>
```
GET /v1/sessions
```
```
{
  "cinema": "92", // can be null, if null then get sessions for all cinemas
  "city": "Винница",
  "film": "12", // film id
  "partOfDay": "morning" // other variant: "afternoon", "evening"
}
```
```
+ headers
```
<i>Ответ:</i>
```
[
  "success": "true",
  "sessions": [
    {
      "cinema": "92", // cinema id
      "startTime": "15011341",
      "endTime": 15012259",
      "hallNumber": "12",
      "cost": "75",
      "format": "3d"
    },
    {
      "cinema": "92",
      "startTime": "15055991",
      "endTime": 15056902",
      "hallNumber": "3",
      "cost": "110",
      "format": "iMax"
    }
  ]
]
```
<br></br>
