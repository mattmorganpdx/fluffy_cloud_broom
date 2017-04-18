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
