from locust import HttpUser, task, between
from random import randint
from datetime import datetime

def makename(length):
    result = ''
    characters = 'abcdefghijklmnopqrstuvwxyz_ '
    charactersLength = len(characters)
    for i in range(length):
        result += characters[randint(0,charactersLength-1)]
    return result


class QuickstartUser(HttpUser):
    wait_time = between(0.5, 1)
    
    def on_start(self):  
        self.user_id = self.login()
    
    @task
    def loadtest(self):  
        while True:
            self.channel_id = self.all_channels()  # one channel_id is selected
            if randint(1,8)==1:
                res = self.channel_create()  
                if res != '':
                    self.channel_id = res
                    print(self.user_id, 'create', self.channel_id)
            else:
                self.channel_enter()   
                print(self.user_id, 'enter', self.channel_id)

            #self.get_messages()       ### TODO
            while randint(1,10)!=1:
                #self.send_messages()  ### TODO
                #self.get_messages()   ### TODO
            
            print(self.user_id, 'leave', self.channel_id)
            res = self.channel_leave()  

            if randint(1,5)==1:
                break

    def on_stop(self):
        None

    def hello_world(self):
        self.client.get("/")

    def login(self):
        # create a user
        username =  makename(randint(5,14))
        password =  makename(randint(8,16))
        response = self.client.post("/login", json={"username":username, "password":password}).json()
        return username  ### 暫不處理error狀況
        
    def all_channels(self):
        ### TODO 
        # response = self.client.get("/all_channels", json={"limit": 100}).json()
        # if len(response) != 0:
        #    idx = randint(0,len(response))
        #    return response[idx]["channel_id"]  
        # return ''
        channel_list = ['3SIOUyA1Kngjhs68', 'test2','CgxKh6xkXUCndMMV','M2x1Uucyg78km29B', 'K2nQfuSVzesLzkD7']
        return channel_list[randint(0,4)]

    def channel_create(self):
        response = self.client.post("/channel", json={"action": "create", "uid": self.user_id,"channel_name": makename(randint(8,20) )}).json()
        try:
            return response["channel_id"]
        except:
            return ''
        
    def channel_enter(self):
        response = self.client.post("/channel", json={"action": "enter","channel_id": self.channel_id,"uid": self.user_id}).json()
        
    def channel_leave(self):
        response = self.client.post("/channel", json={"action": "leave","channel_id":self.channel_id,"uid": self.user_id}).json()
            
    def send_messages(self):
        self.client.post("/message", json={"channel_id": self.channel_id,"type":"text", "text": makename(randint(3,20)), "sender_id": self.user_id,"sender_avatar": '',"datetime": datetime.now().strftime("%Y-%m-%d %H:%M:%S")})
        
    def get_messages(self, count = 30):
        self.client.post("/all_messages", json={ "channel_id": self.channel_id, "message_id": '', "count": count})
        
    #def channel_reload(self):


