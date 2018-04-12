import requests
import json

rep1 = requests.post("http://localhost:5000/api/login", json={"email":"david.ayache90@gmail.com", "password":"123azerty"})

#print(rep1.cookies)
print(rep1)

##print(rep1.json())

#total fake 

rep = requests.get("http://localhost:5000/api/test", cookies=rep1.cookies)

print(rep)

#print(rep.json())