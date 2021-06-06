import time
from locust import HttpUser, task, between

class QuickstartUser(HttpUser):
    wait_time = between(0.5, 1)

    @task
    def hello_world(self):
        self.client.get("/")

    @task
    def login(self):
        self.client.post("/login", json={"username":"foo", "password":"bar"})

    def on_start(self):
        self.client.post("/login", json={"username":"foo", "password":"bar"})