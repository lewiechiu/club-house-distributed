#

docker build -t distributed-chat . && \
docker tag distributed-chat:latest 974977415348.dkr.ecr.us-east-2.amazonaws.com/distributed-chat:latest && \
docker push 974977415348.dkr.ecr.us-east-2.amazonaws.com/distributed-chat:latest
