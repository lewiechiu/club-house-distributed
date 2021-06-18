from locust import HttpUser, task, between
from random import randint
from datetime import datetime
import socketio  
 
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
        self.sio.connect("http://localhost:8080", transports='websocket')
        
        self.token, self.channel_id = "", ""

        self.username = makename(randint(5,14))
        self.login()
        
        @self.sio.on('login_response')
        def login_response(data):
            print(self.username, 'login')
            self.token = data['token']
            self.all_channels()
             
        @self.sio.on('channel_response')
        def channel_response(data):
            try:
                if data["action"] == 'get_all':
                    print(self.username, 'get all channels')
                    res_list = data["data"]
                    if len(res_list) != 0:
                        idx = randint(0,len(res_list))
                        self.channel_id = res_list[idx]["channel_id"]   
                        self.channel_enter()          
                elif data["action"] == 'create':
                    print(self.username, 'create', self.channel_id)
                    self.channel_id = data["channel_id"]
                    self.into_new_channel()

                elif data["action"] == 'enter':
                    print(self.username, 'enter', self.channel_id)
                    self.into_new_channel() 
                elif data["action"] == 'leave':
                    print(self.username, 'leave', self.channel_id)
            except:
                None

        @self.sio.on('message_response')
        def message_response(data):
                if data["action"] == 'send':
                    print(self.username, 'send message to ', self.channel_id)
                elif data["action"] == 'get_all':
                    print(self.username, 'get messages from', self.channel_id)
            
    @task
    def loadtest(self):  
        self.all_channels()

    def into_new_channel(self):
               
        while True:  
            self.get_messages()   

            while randint(1,10)!=1:
                self.send_messages() 
             
            self.channel_leave()  

            if randint(1,5)==1:
                break
            else:
                if randint(1,8)==1:
                    self.channel_create()      
                else:
                    self.all_channels() 
                

    def on_stop(self):
        self.sio.disconnect()

    def hello_world(self):
        self.client.get("/")

    def login(self):
        # create a user
        password =  makename(randint(8,16))
        data = {
            "username": self.username,
            "password": password
        }
        self.sio.emit('login', data )
        
    
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
        
