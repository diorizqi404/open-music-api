
# OpenMusic API (Queue Consumer)

This is a Queue Consumer for exporting songs. Only works with OpenMusic API V3. THIS PROJECT IS ONLY USED FOR LEARNING, IT IS FORBIDDEN TO COPY THIS PROJECT TO BE USED AS YOUR SUBMISSION.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Setup & Run the project](#setup--run-the-project)
- [Environment Variables](#environment-variables)
- [Authors](#authors)

## Tech Stack
This website is built with several tech stacks below:

**Database:** PostgreSQL

**Message Broker:** RabbitMQ

**Consumer:** NodeJS, NodeMailer


## Setup & Run the project

### 1. Clone the project

```bash
  git clone -b queue-consumer https://github.com/diorizqi404/open-music-api.git
```

### 2. Go to the project directory

```bash
  cd open-music-api
```

### 3. Install dependencies

```bash
  npm install
```

### 4. Start the server

```bash
  npm run start
```
> For production deployments, the steps are the same. You should use pm2 instead of nodemon.

## Environment Variables

To run this project, you will need to change the following environment variables to your .env file for backend and api.js for frontend.

.env file
```bash
    PGUSER=YOUR_DB_USER
    PGHOST=YOUR_DB_HOST
    PGPASSWORD=YOUR_DB_PASSWORD
    PGDATABASE=YOUR_DB_NAME
    PGPORT=YOUR_DB_PORT

    SMTP_HOST=YOUR_SMTP_HOST
    SMTP_PORT=YOUR_SMTP_PORT
    SMTP_USER=YOUR_SMTP_USER
    SMTP_PASSWORD=YOUR_SMTP_PASSWORD

    RABBITMQ_SERVER=amqp://YOUR_RABBITMQ_HOST
```

> If you want use in local/production, copy file .env.example.

## Authors

- [@diorizqi404](https://www.github.com/diorizqi404)
