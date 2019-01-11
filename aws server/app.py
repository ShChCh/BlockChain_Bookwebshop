from flask import Flask
from redis import Redis, RedisError
import os
import socket
from flask import request, jsonify, make_response
import hashlib

# Connect to Redis
redis = Redis(host="redis", db=0, socket_connect_timeout=2, socket_timeout=2)

app = Flask(__name__)

nameArr = [] # normal
pswdArr = [] # md5
hashArr = [] # md5

def addKVH(K, V, H):
    if existKVH(K, V, H):
        return False
    nameArr.append(K)
    pswdArr.append(V)
    hashArr.append(H)
    return True

def updateKVH(K, V, H):
    for i in range(0, len(nameArr)):
        if nameArr[i] == K:
            pswdArr[i] = V
            hashArr[i] = H
            return True
    return False

def existKVH(K, V, H):
    for i in range(0, len(nameArr)):
        if nameArr[i] == K and pswdArr[i] == V and hashArr[i] == H:
            return True
    return False
    
def rmvKVH(K, V, H):
    for i in range(0, len(nameArr)):
        if nameArr[i] == K and pswdArr[i] == V and hashArr[i] == H:
            del nameArr[i]
            del pswdArr[i]
            del hashArr[i]
            return True
    return False
    

@app.route("/", methods=['GET','POST'])
def login():
    try:
        visits = redis.incr("counter")
    except RedisError:
        visits = "<i>cannot connect to Redis, counter disabled</i>"
    u = request.args.get('usr')
    p = request.args.get('pwd')
    h = request.args.get('hsad')
    
    msg = 'no'
    # name ,  pswd.md5,  hashAddr.md5
    if existKVH(u, p, h):
        msg = u
    
    print(nameArr)
    print(pswdArr)
    print(hashArr)
    resp = jsonify(msg)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    
    return resp, 200

# register
@app.route("/reg", methods=['GET','POST'])
def regist():
    try:
        visits = redis.incr("counter")
    except RedisError:
        visits = "<i>cannot connect to Redis, counter disabled</i>"
    u = request.args.get('usr')
    p = request.args.get('pwd')
    h = request.args.get('hsad')
    
    msg = 'no'
    # name ,  pswd.md5,  hashAddr.md5
    if not existKVH(u, p, h):
        addKVH(u, p, h)
        msg = u

    resp = jsonify(msg)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    
    return resp, 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
