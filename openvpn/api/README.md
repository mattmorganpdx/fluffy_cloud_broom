# api end points to work with the cert database.

### GET method:

> ip:port/ovpn/api/v1.0/active_certs returns a json doc with a root call certs. ex:

```
curl -i http://10.8.0.1:5000/ovpn/api/v1.0/active_certs
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 1375
Server: Werkzeug/0.12.1 Python/3.5.2
Date: Tue, 11 Apr 2017 03:09:35 GMT

{
  "certs": [
    {
      "active": "1",
      "creation_time": "04/04/2017 03:58:58",
      "file_name": "pdxcert6.ovpn",
      "id": 1,
      "last_login": "",
      "path": "/home/mmorgan/client-configs/files/pdxcert6.ovpn"
    }, ...
    ]
}    
```
### POST method:

> ip:port/ovpn/api/v1.0/active_certs takes a json document, adds a cert and returns the json doc back. ex.

```
curl -i -H "Content-Type: application/json" -X POST -d '{"name":"test2","active":"False","ctime":"test","path":"test","last":""}' http://10.8.0.1:5000/ovpn/api/v1.0/active_certs
HTTP/1.0 201 CREATED
Content-Type: application/json
Content-Length: 143
Server: Werkzeug/0.12.1 Python/3.5.2
Date: Tue, 11 Apr 2017 03:18:30 GMT

{
  "cert": {
    "active": "False",
    "creation_time": "test",
    "file_name": "test2",
    "last_login": "",
    "path": "test"
  }
}
```

### DELETE method:

> ip:port/ovpn/api/v1.0/active_certs/<id #> will delete the doc if it exists and return True or will return 400. ex

```
curl -i -X DELETE http://10.8.0.1:5000/ovpn/api/v1.0/active_certs/7                                                                                 HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 21
Server: Werkzeug/0.12.1 Python/3.5.2
Date: Tue, 11 Apr 2017 03:20:22 GMT

{
  "result": true
}
```

> when the doc doesn't exist

```
curl -i -X DELETE http://10.8.0.1:5000/ovpn/api/v1.0/active_certs/7                                                                                 HTTP/1.0 400 BAD REQUEST
Content-Type: text/html
Content-Length: 192
Server: Werkzeug/0.12.1 Python/3.5.2
Date: Tue, 11 Apr 2017 03:21:57 GMT

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<title>400 Bad Request</title>
<h1>Bad Request</h1>
<p>The browser (or proxy) sent a request that this server could not understand.</p>
```
### PUT Method:

> this method is not implimented yet. When it is it will behave like this :

```
curl -i -H "Content-Type: application/json" -X PUT -d \
'{"name":"test2","active":"False","ctime":"test","path":"test","last":""}' \
http://10.8.0.1:5000/ovpn/api/v1.0/active_certs/<id>
```

* So basically it work like the POST except you give it /<id> so it knows what you are trying to update.
