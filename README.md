# cinemaServer
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
