import os
import json

dictionnaire = {}

notCollision = []
mechantBlock = []

path = "./blocks/"

for filename in os.listdir(path):
    id = filename.replace(".png", "")
    y = int(int(id) / 32)
    x = int(int(id) - (y * 32))
    if id in notCollision:
        collision = False
    else:
        collision = True
    if id in mechantBlock:
        mechant = True
    else:
        mechant = False
    dictionnaire[id] = {"x": x, "y": y, "collision": collision, "agressive": mechant}

print(json.dumps(dictionnaire))
