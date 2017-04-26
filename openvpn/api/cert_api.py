import active_certs
from flask import Flask, jsonify, request, abort
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

@app.route('/ovpn/api/v1.0/active_certs', methods=['GET'])
def get_active_certs():
    certs = active_certs.get_active_certs()
    response =  jsonify({'certs': certs})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/ovpn/api/v1.0/active_certs', methods=['POST'])
def add_cert():
    if not request.json:
        abort(400)
    data = {
        'file_name': request.json['file_name'],
        'path': request.json['path'],
        'creation_time': request.json['creation_time'],
        'active': request.json['active'],
        'last_login': request.json['last_login']}
    with open('log', 'a') as f:
        f.write(str(data))
    active_certs.add_cert(data)
    response = jsonify({'cert': data})
    # response.headers.add('Access-Control-Allow-Origin', '*')
    # response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    return response, 201

@app.route('/ovpn/api/v1.0/active_certs/<int:_id>', methods=['PUT'])
def update_cert(_id):
    certs = [cert for cert in active_certs.get_active_certs() if cert['id'] == _id]
    if len(certs) == 0:
        abort(400)
    if not request.json:
        abort(400)
    if 'file_name' in request.json and type(request.json['file_name']) != unicode:
        abort(400)
    if 'path' in request.json and type(request.json['path']) != unicode:
        abort(400)
    if 'creation_time' in request.json and type(request.json['creation_time']) != unicode:
        abort(400)
    if 'active' in request.json and type(request.json['active']) is not bool:
        abort(400)
    if 'last_login' in request.json and type(request.json['last_login']) != unicode:
        abort(400)
    certs[0]['file_name'] = request.json.get('file_name', certs[0]['file_name'])
    certs[0]['path'] = request.json.get('path', certs[0]['path'])
    certs[0]['creation_time'] = request.json.get('creation_time', certs[0]['creation_time'])
    certs[0]['active'] = request.json.get('active', certs[0]['active'])
    certs[0]['last_login'] = request.json.get('last_login', certs[0]['last_login'])
    response = jsonify({'cert': certs[0]})
    return response

@app.route('/ovpn/api/v1.0/active_certs/<int:_id>', methods=['DELETE'])
def del_cert(_id):
    certs = [cert for cert in active_certs.get_active_certs() if cert['id'] == _id]
    if len(certs) == 0:
        abort(400)
    active_certs.del_cert(_id)
    response = jsonify({'result': True})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
