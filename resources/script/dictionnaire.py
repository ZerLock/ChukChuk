import os
import json

dictionnaire = {}

notCollision = ["032", "033", "036", "037", "044", "068", "326", "327", "328", "384", "385", "386", "387", "388", "418", "424", "430", "459", "460"]
mechantBlock = ["416", "417", "418", "419", "420", "421", "422", "424", "425", "426", "427", "428", "430"]
upper = {
    "001": "578",
    "002": "578",
    "003": "578",
    "004": "578",
    "005": "530",
    "006": "614",
    "007": "614",
    "008": "104",
    "009": "104",
    "010": "320",
    "011": "320",
    "012": "321",
    "013": "321",
    "525": "526"
}

path = "./blocks/"

for filename in os.listdir(path):
    id = filename.replace(".png", "")
    y = int(int(id) / 32)
    x = int(int(id) - (y * 32))
    if id in upper.keys():
        upperId = upper[id]
    else:
        upperId = id
    if id in notCollision:
        collision = False
    else:
        collision = True
    if id in mechantBlock:
        mechant = True
    else:
        mechant = False
    dictionnaire[id] = {"x": x, "y": y, "collision": collision, "agressive": mechant, "upper": upperId}

print(json.dumps(dictionnaire))
