import os
import json

dictionnaire = {}

notCollision = ["032", "033", "036", "037", "044", "068", "326", "327", "328", "384", "385", "386", "387", "388", "418", "424", "430", "459", "460"]
mechantBlock = ["416", "417", "418", "419", "420", "421", "422", "424", "425", "426", "427", "428", "430"]

path = "./blocks/"

for filename in os.listdir(path):
    id = filename.replace(".png", "")
    if id in notCollision:
        collision = False
    else:
        collision = True
    if id in mechantBlock:
        mechant = True
    else:
        mechant = False
    dictionnaire[filename.replace(".png", "")] = {"path": path + filename, "collision": collision, "agressive": mechant}

print(json.dumps(dictionnaire))
