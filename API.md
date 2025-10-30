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

