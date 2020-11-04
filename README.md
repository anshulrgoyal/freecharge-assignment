# Demo App for sharing files

The app create a file in File System and save a document in database for managing ownership.

## APIs

1. (POST) `/api/user/signin` for getting a token. It takes email and password and return JWT token.

- Request:

```json
{
  "email": "anshul@example.com",
  "password": "password12345"
}
```

- Response:

```json
{
  "token": "<jsontoken>"
}
```

2. (POST) `/api/user/register` for creating a user. It takes email, name and password. It return JWT token.

- Request

```json
{
  "name": "anshul",
  "email": "anshul@example.com",
  "password": "password12345"
}
```

- Response:

```json
{
  "token": "<jsontoken>"
}
```

3. (GET) `/api/file` for get all the file form database.

- Response:

```json
[
  {
    "_id": "5fa3075431087ddf20352705",
    "name": "Adobe Scan Nov 04, 2020.pdf",
    "mimetype": "application/pdf",
    "__v": 0
  }
]
```

4. (Get) `/api/file/:id` for getting file.

- Response: <File>

5. (Delete) `/api/file/:id` for deleting a file from Fs and database

- Request:

  - Header : `Authorization: Bearer <token>`

- Response:

```json
{
  "message": "success"
}
```

6. (Post) `/api/file/` for creating a file in fs and database

- Request:

  - Header : `Authorization: Bearer <token>`

- Response:

```json
{
  "_id": "5fa308a731087ddf20352706",
  "path": "/home/agoyal/app/backend/uploads/mozilla.pdf-1604520103565",
  "name": "mozilla.pdf",
  "owner": "5fa2b0a03ea4dd68fb99385d",
  "mimetype": "application/pdf",
  "__v": 0
}
```

### Hosted

- Backend: [https://freechargedemo.herokuapp.com/](https://freechargedemo.herokuapp.com/)
- Frontend: [https://freechargedemo.netlify.app/](https://freechargedemo.netlify.app/)
