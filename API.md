# API Documentation

## Authentication

### Register User

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string"
  }
}
```

**Error Response (400):**

```json
{
  "error": "User already exists with this email"
}
```

### Login User

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logged in successfully",
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string"
  }
}
```

**Error Response (400):**

```json
{
  "error": "Invalid credentials"
}
```

### Logout User

**Endpoint:** `POST /auth/logout`

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Boards

### Get All Boards

Get all boards for a user (owned + collaborated).

**Endpoint:** `GET /boards`

**Query Parameters:**

- `userId` (required) - User ID

**Response:**

```json
{
  "response": [
    {
      "id": "123",
      "title": "example",
      "thumbnail": null,
      "createdAt": "2025-10-27T10:00:00Z",
      "updatedAt": "2025-10-28T15:30:00Z",
      "isOwner": true,
      "myRole": "OWNER",
      "sharedBy": null,
      "collaboratorCount": 3
    },
    {
      "id": "456",
      "title": "example",
      "thumbnail": "https://...",
      "createdAt": "2025-10-25T08:00:00Z",
      "updatedAt": "2025-10-27T12:00:00Z",
      "isOwner": false,
      "myRole": "EDITOR",
      "sharedBy": "Alice Smith",
      "collaboratorCount": 5
    }
  ]
}
```

**Example:**

```bash
GET /boards?userId=user-123
```

### Create Board

**Endpoint:** `POST /boards`

**Request Body:**

```json
{
  "title": "string",
  "thumbnail": "string (optional)",
  "userId": "string"
}
```

**Success Response (201):**

```json
{
  "message": "Board created successfully",
  "newBoard": {
    "id": "uuid",
    "title": "string",
    "thumbnail": "string or null",
    "elements": {},
    "ownerId": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

### Update Board

**Endpoint:** `PATCH /boards/:id`

**Query Parameters:**

- `userId` (required) - User ID

**Request Body:**

```json
{
  "title": "string (optional)",
  "thumbnail": "string (optional)",
  "elements": "object (optional)"
}
```

**Success Response (200):**

```json
{
  "message": "Board updated successfully",
  "updatedBoard": {
    "id": "uuid",
    "title": "string",
    "thumbnail": "string or null",
    "elements": {},
    "ownerId": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Error Response (403):**

```json
{
  "error": "Access denied. Only board owner or editors can update the board"
}
```

### Delete Board

**Endpoint:** `DELETE /boards/:id`

**Query Parameters:**

- `userId` (required) - User ID

**Success Response (200):**

```json
{
  "message": "Board deleted successfully"
}
```

**Error Response (403):**

```json
{
  "error": "Only the board owner can delete this board"
}
```
