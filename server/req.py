import requests
import json

rep1 = requests.post("http://localhost:8080/api/login", json={"username":"admin", "password":"password"})

#print(rep1.cookies)
print(rep1.headers)

##print(rep1.json())

#total fake 

rep = requests.get("http://localhost:8080/api/test")

print(rep)

#print(rep.json())