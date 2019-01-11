from flask import Flask
from redis import Redis, RedisError
import os
import socket
from flask import request, jsonify, make_response

# Connect to Redis
redis = Redis(host="redis", db=0, socket_connect_timeout=2, socket_timeout=2)

app = Flask(__name__)

@app.route("/", methods=['GET','POST'])
def hello():
    try:
        visits = redis.incr("counter")
    except RedisError:
        visits = "<i>cannot connect to Redis, counter disabled</i>"
    u = request.args.get('usr')
    p = request.args.get('pwd')
    
    resp = jsonify({'re':True})
    resp.headers['Access-Control-Allow-Origin'] = '*'

    resp2 = jsonify({'re':False})
    resp2.headers['Access-Control-Allow-Origin'] = '*'

    if u=='Franky' and p=='123456':
        return resp, 200
    if u=='Daddy' and p=='012345':
        return resp, 200
    return resp2, 400

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)