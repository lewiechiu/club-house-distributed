# club-house-distributed

[Final Presentation Slide](https://docs.google.com/presentation/d/177_vqUotpxW6AgzI05OvaxLFN3eTbKgJitlfcCVlQck/edit#slide=id.gddd72dbfce_0_12)

[report](https://hackmd.io/BHDdq1nuSnuoUh1eDv3gtg?both)

[API doc](https://hackmd.io/uFiF_V7eR-Wf-O8ZQ4sgsA?both)

## prerequisites

You need to setup aws-sdk, and add aws credentials in `profile_service` before you run.

```
# example profile_service
[default]
aws_access_key_id = <aws_access_key_id>
aws_secret_access_key = <aws_secret_access_key>
```

## Packages

```
aws-sdk
uuid
nodemon
```

## How to run

Docker version

```docker
docker-compose build & docker-comose up
```

npm version

```bash
# Frontend
cd frontend
npm install
npm start
```

```bash
# backend service
cd profile_service
npm install
npm start

# redis
cd profile_service
docket run -d -p 6379:6379 redis:alpine
```

## Serevice port

frontend
`localhost:3000`

backend
`http://0.0.0.0:8080` and `http://0.0.0.0:8081`

redis `localhost:6379`

### Testing

```bash
cd profile_service
locust locust_loadtest.py
```

## Project Structure

```bash
# root
|____.gitignore
|____README.md
|____docker-compose.yml

# frontend dir
|____frontend
# config
| |____.dockerignore
| |____.gitignore
| |____craco.config.js
| |____package-lock.json
| |____package.json
# deploy
| |____Dockerfile
# client code
| |____src
| | |____index.js
| | |____styles
| | | |____App.css
| | | |____channel.css
# components
| | |____components
| | | |____Channel.js
| | | |____ChannelList.js
| | | |____Login.jsx
| | | |____Chat.js
| | | |____ChannelItem.js
| | |____App.jsx
# middleware
| | |____services
| | | |____msg.service.js
| | | |____SocketClient.js
| | | |____auth.service.js
| | | |____channel.service.js
| | | |____upload-files.service.js

# backend service
|____profile_service
# config
| |____.dockerignore
| |____config.js
| |____README.md
| |____package-lock.json
| |____package.json
| |____index.html
# deplopy
| |____Dockerfile
| |____build_and_push.sh
# service code
| |____server.js
| |____channel.js
| |____profile.js
| |____utils.js
| |____credentials
| |____message.js
# Create DynamoDB service object
| |____ddb_ex.js

# stress test
|____stress
| |____locust_loadtest.py
| |____locust.py

# aws ECS Task Definition
|____aws
| |____ecs_be_task_def.json
| |____ecs_fe_task_def.json
```
