import os
import sqlite3
import sys
import time

def create_db():

    db = sqlite3.connect('certs.db')
    db_cursor = db.cursor()
    db_cursor.execute('''create table if not exists active_certs (name TEXT, active TEXT, path TEXT, ctime TEXT, last TEXT)''')
    db.commit()
    CERT_PATH = '/home/mmorgan/client-configs/files/'
    
    ovpn_files = os.listdir(CERT_PATH)
    
    return_data = []
    
    for file in ovpn_files:
        if 'ovpn' in file:
            return_data.append({'file_name': file,
                                'creation_time': time.strftime('%m/%d/%Y %H:%M:%S',
                                                               time.gmtime(os.stat(os.path.join(CERT_PATH, file)).st_ctime)),
                                'path': os.path.join(CERT_PATH, file),
                                'active': True,
                                'last_login': ''
                                }
                               )

    for data in return_data:
        db_cursor.execute('INSERT INTO active_certs VALUES (?,?,?,?,?)', (data['file_name'], data['active'], data['path'], data['creation_time'], data['last_login']))
        db.commit()

    db.close()

def get_active_certs():
    def result_to_dict(_id, name, active, path, ctime, last):
        return {'id': _id,
                'file_name': name,
                'path': path,
                'creation_time': ctime,
                'active': active,
                'last_login': last}
    db = sqlite3.connect('certs.db')
    db_cursor = db.cursor()
    results = db_cursor.execute('SELECT rowid, * from active_certs')
    return_data = [result_to_dict(*r) for r in results.fetchall()]
    db.close()
    return return_data

def add_cert(data):
    db = sqlite3.connect('certs.db')
    db_cursor = db.cursor()
    db_cursor.execute('INSERT INTO active_certs VALUES (?,?,?,?,?)', (data['file_name'], data['active'], data['path'], data['creation_time'], data['last_login']))
    db.commit()
    db.close()
    return

def del_cert(_id):
    db = sqlite3.connect('certs.db')
    db_cursor = db.cursor()
    db_cursor.execute('DELETE from active_certs where rowid=:id', {"id": _id}) 
    db.commit()
    db.close()
    return

if __name__ == '__main__':
    if len(sys.argv) > 1:
        create_db()
    else:
        get_active_certs()
