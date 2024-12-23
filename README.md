
# OpenMusic API

This project is a submission for the dicoding class ‘learning the fundamentals of backend applications’. In this repository there are V1, V2, and V3 + Queue Consumer. THIS PROJECT IS ONLY USED FOR LEARNING, IT IS FORBIDDEN TO COPY THIS PROJECT TO BE USED AS YOUR SUBMISSION.

#### This main branch is refer to V3 branch but there are new improvements.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Setup & Run the project](#setup--run-the-project)
- [Environment Variables](#environment-variables)
- [Authors](#authors)

## Tech Stack
This website is built with several tech stacks below:

**API:** NodeJS, Hapi, JWT

**Database:** PostgreSQL

**Message Broker:** RabbitMQ

**Caching:** Redis

**Consumer:** NodeJS, Hapi, NodeMailer


## Setup & Run the project

### 1. Clone the project

```bash
  git clone https://github.com/diorizqi404/open-music-api.git
```

### 2. Go to the project directory

```bash
  cd open-music-api
```

### 3. Install dependencies

```bash
  npm install
```

### 4. Migrate Database

```bash
  npm run migrate up
```

### 5. Start the server

```bash
  npm run start-dev
```
> For production deployments, the steps are the same. You should use pm2 instead of nodemon.

## Environment Variables

To run this project, you will need to change the following environment variables to your .env file.

.env file
```bash
  SERVER_URL=YOUR_SERVER_URL
 
  PGUSER=YOUR_DB_USER
  PGHOST=YOUR_DB_HOST
  PGPASSWORD=YOUR_DB_PASSWORD
  PGDATABASE=YOUR_DB_NAME
  PGPORT=YOUR_DB_PORT
  
  RABBITMQ_SERVER=amqp://YOUR_AMQP_HOST
  
  REDIS_SERVER=YOUR_REDIS_HOST
```

> If you want use in production, copy file .env.example.

## Authors

- [@diorizqi404](https://www.github.com/diorizqi404)
