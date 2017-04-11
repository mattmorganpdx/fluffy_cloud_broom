import active_certs
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/ovpn/api/v1.0/active_certs', methods=['GET'])
def get_active_certs():
    certs = active_certs.get_active_certs()
    return jsonify({'certs': certs})


@app.route('/ovpn/api/v1.0/active_certs', methods=['POST'])
def add_cert():
    if not request.json:
        abort(400)
    data = {
        'file_name': request.json['name'],
        'path': request.json['path'],
        'creation_time': request.json['ctime'],
        'active': request.json['active'],
        'last_login': request.json['last']}
    active_certs.add_cert(data)
    return jsonify({'cert': data}), 201

@app.route('/ovpn/api/v1.0/active_certs/<int:_id>', methods=['DELETE'])
def del_cert(_id):
    certs = [cert for cert in active_certs.get_active_certs() if cert['id'] == _id]
    if len(certs) == 0:
        abort(400)
    active_certs.del_cert(_id)
    return jsonify({'result': True})


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
