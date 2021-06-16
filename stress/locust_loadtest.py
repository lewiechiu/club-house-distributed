# locust -f locust_loadtest.py -H http://localhost:8888
from locust import HttpUser, task, between
from random import randint
from datetime import datetime
import socketio  #https://python-socketio.readthedocs.io/en/latest/client.html
 
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
        self.sio = socketio.Client()
        self.sio.connect("http://18.116.51.105:8080", transports='websocket')
        
        self.username, self.token, self.channel_id = "", "", ""
        self.login()
        
        '''@self.sio.on('login_response')
        def login_response(data):
            data = data.json()
            self.username = data['username']
            self.token = data['token']
            
        
        @self.sio.on('channel_response')
        def channel_response(data):
            data = data.json()
            if data["action"] == 'get_all':
                res_list = data["data"]
                if len(res_list) != 0:
                    idx = randint(0,len(res_list))
                    self.channel_id = res_list[idx]["channel_id"]  
            elif data["action"] == 'create':
                self.channel_id = data["channel_id"]
            
        '''
        
    
    @task
    def loadtest(self):  
        
        while True:
            self.channel_id = self.all_channels()  # one channel_id is selected
            if randint(1,8)==1:
                res = self.channel_create()  
                if res != '':
                    self.channel_id = res
                    self.get_messages()   
                    #print(self.username, 'create', self.channel_id)
            else:
                self.channel_enter()   
                self.get_messages()   
                #print(self.username, 'enter', self.channel_id)

            while randint(1,10)!=1:
                self.send_messages() 
            
            #print(self.username, 'leave', self.channel_id)
            self.channel_leave()  

            if randint(1,5)==1:
                break


    def on_stop(self):
        self.sio.disconnect()

    def hello_world(self):
        self.client.get("/")

    def login(self):
        # create a user
        username =  makename(randint(5,14))
        password =  makename(randint(8,16))
        self.sio.emit('login', { "username":username, "password":password} )
        
    
    def all_channels(self):
        data = {
            "username": self.username,
            "token": self.token,
            "action": 'get_all',
            "channel_id": self.channel_id
        }
    
        self.sio.emit('channel', data)
        
            
    def channel_create(self):
        data = {
            "username": self.username,
            "token": self.token,
            "action": 'create',
            "channel_name": makename(randint(8,20)),
            "avatar_url": ""
        }

        self.sio.emit('channel', data)
        
    def channel_enter(self):
        data = {
            "username": self.username,
            "token": self.token,
            "channel_id": self.channel_id,
            "action": 'enter',
            "avatar_url": ""
        }
        self.sio.emit('channel', data)
        
    def channel_leave(self):
        data = {
            "username": self.username,
            "token": self.token,
            "action": 'leave',
            "channel_id": self.channel_id
        }
        self.sio.emit('channel', data)
        
    def send_messages(self):
        data = {
            "username": self.username,
            "token": self.token,
            "action": 'send',
            "channel_id": self.channel_id,
            "type": "type",
            "text": makename(randint(3,20)),
            "image_url": "",
            "sender_avatar": "",
            "datetime": ""
        }
        self.sio.emit('message', data)
        
    def get_messages(self, count = 30):
        data = {
            "username": self.username,
            "token": self.token,
            "action": 'get_all',
            "channel_id": self.channel_id,
            "message_id": ""
        }
        self.sio.emit('message', data)
        
