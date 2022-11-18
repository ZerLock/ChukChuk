import os
import json

dictionnaire = {}

path = "./blocks/"

for filename in os.listdir(path):
    dictionnaire[filename.replace(".png", "")] = path + filename

print(json.dumps(dictionnaire))
