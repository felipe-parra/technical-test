# Technical test - Felipe Parra

For this test I used Fast API for the backend and Next JS (13.3).

#### Development mode

- The backend will be running on port 8081 (localhost)
- The frontend will be running on port 3000 (localhost)

## 🛠 Getting started Backend

### Navigate to backend

```
cd backend
```

### Create the environment variables file, like `.env.example` with your values:

```
JWT_SECRET=JWT_SECRET_EXAMPLE
JWT_ALGORITHM=HS256
```

### Create and activate a virtual environment:

```
python3 -m venv venv && source venv/bin/activate
```

### Install packages

```
pip install -r requirements.txt
```

### Run local server

```
python main.py
```

#

## 💡 Getting started Frontend

### Move to client folder

```
cd frontend
```

### Install packages

```
npm install
```

### Start client server - development

```
npm run dev
```

### 😄 Usual problems

- When installing `node_modules`, there can commonly be problems installing the packages either due to cache or incomplete downloads due to internet connection problems.

_It can be solved by deleting the `node_modules` folder, and downloading them again:_

```
rm -rf node_modules
```
