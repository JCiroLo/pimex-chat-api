# pimex-chat

pimex chat backend

## Getting started
```bash 
  npm install
  
  npm run dev
```

### Config files

All configuration files must be inside the `config` folder.
It is important that this directory is never uploaded to the repository with changes.

### `pimex-chat-firebase-admin.json`
- The service account json file from firebase

### `.env`
Set env variables, the fields with `*` are required

| Field | Description |
| :--- | :--- |
| `PORT` | Port where the server will start, (4000) |

#### Add chat

```http
  POST /chat
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `boardId` | `string` | `* board id` |
| `location` | `Object` | `* the location object from https://freegeoip.app/json/` |

#### Add message

```http
  POST /message
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `boardId` | `string` | `* board id` |
| `msg` | `String` | `* message to add` |
| `chatId` | `String` | `* chat id` |
| `senderId` | `String` | `* client id` |
| `senderType` | `String` | `* type of sender (client or board)` |

## Add your files

- [ ] [Create](https://gitlab.com/-/experiment/new_project_readme_content:4d6ec599a1fede9ec25c178b7c2bbde5?https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://gitlab.com/-/experiment/new_project_readme_content:4d6ec599a1fede9ec25c178b7c2bbde5?https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://gitlab.com/-/experiment/new_project_readme_content:4d6ec599a1fede9ec25c178b7c2bbde5?https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/jpajoy/pimex-chat.git
git branch -M main
git push -uf origin main
```
