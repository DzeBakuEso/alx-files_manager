# 0x04. Files Manager

## Description

This project is a culmination of our back-end trimester at ALX, covering core concepts such as:

- **User authentication**
- **API development using ExpressJS**
- **Data storage using MongoDB**
- **Temporary storage with Redis**
- **Background processing using Kue**
- **Image thumbnail generation**
- **File upload and permission management**

The main objective is to build a simple and functional platform for uploading and managing files, mimicking real-world services like Google Drive or Dropbox.

## Team

- **Dzeble Baku** (Team of 2)

---

## 📅 Project Timeline

- **Start Date:** June 18, 2025 – 6:00 PM  
- **End Date:** June 25, 2025 – 6:00 PM  
- **Checker Release:** June 20, 2025 – 12:00 PM  
- **Manual QA Review:** Required  
- **Auto Review:** At deadline

---

## Features

- User registration and authentication via token
- List all files for a user
- Upload new files
- Change file permission
- View a file
- Generate thumbnails for uploaded images

---

## Technologies Used

- **JavaScript (ES6)**
- **NodeJS**
- **ExpressJS**
- **MongoDB**
- **Redis**
- **Kue**
- **Mocha & Nodemon for testing/development**
- **Bull (background job queue)**
- **Image thumbnailing**
- **MIME types handling**

---

## Requirements

- Allowed editors: `vi`, `vim`, `emacs`, `VS Code`
- OS: Ubuntu 18.04 LTS
- Node version: `12.x.x`
- Linting: `ESLint`
- Language: JavaScript (`.js`)
- Files must end with a new line
- `README.md` is mandatory
- Run `npm install` to install all dependencies from `package.json`

---

## Resources

- [Node.js Getting Started](https://nodejs.org/en/docs/guides/getting-started-guide/)
- [Process API](https://nodejs.org/api/process.html)
- [Express Guide](https://expressjs.com/en/starter/installing.html)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Redis](https://redis.io/docs/)
- [Bull Docs](https://github.com/OptimalBits/bull)
- [Mocha](https://mochajs.org/)
- [Nodemon](https://nodemon.io/)
- [Image Thumbnail Generation](https://github.com/sindresorhus/sharp)
- [Mime Types](https://www.npmjs.com/package/mime-types)

---

## File Structure

```bash
.
├── controllers/
│   ├── AppController.js
│   └── UsersController.js
├── routes/
│   └── index.js
├── utils/
│   ├── redis.js
│   └── db.js
├── server.js
├── package.json
├── .eslintrc.js
├── babel.config.js
└── README.md

Author : Dzeble Kwame Baku
