import random
import os
import csv
import json
import shutil
import time
import bz2
import sys
import smtplib
from subprocess import Popen
import re
import requests
url = "https://repo.dynastic.co/"
try:
    shutil.rmtree(f"./data")
    os.mkdir(f'./data')
except:
    os.mkdir(f'./data')
    pass
try:
    headers={
        'User-Agent': 'Telesphoreo APT-HTTP/1.0.592'
    }
    r = requests.get(f'{url}/Packages.bz2', headers=headers)
except Exception as e:
    print('Is this a repo?')
    sys.exit(1)
with open(f'./data/Packages.bz2', 'wb') as f:
    f.write(r.content)
try:
    zipfile = bz2.BZ2File('./data/Packages.bz2')
    data = zipfile.read()
except:
    a = Popen(f'bzip2 -d ./data/Packages.bz2', shell=True)
    while a is not None:
            retcode = a.poll()
            if retcode is not None:
                print('Unzipped!')
                data = open(f'{os.getcwd()}/data/Packages').read()
                break
    else:
            time.sleep(1)
filepath = f'./data/repo.csv'
open(filepath, 'wb').write(data)
with open(filepath, 'r+', errors='ignore') as lol:
    try:
        text = lol.read()
    except Exception as e:
        print(f'Error {e} occurred')
    if re.search('/ ', url):
        text = re.sub('Filename: ./debs', f'Filename: {url}debs', text)
        text = re.sub('Filename: ./deb', f'Filename: {url}deb', text)
        text = re.sub('Filename: deb', f'Filename: {url}deb', text)
        text = re.sub('Filename: debs', f'Filename: {url}debs', text)
        text = re.sub('Filename: api', f'Filename: {url}api', text)
        text = re.sub('Filename: pool', f'Filename: {url}pool', text)
        text = re.sub('Filename: files', f'Filename: {url}files', text)
    else:
        text = re.sub('Filename: ./debs', f'Filename: {url}/debs', text)
        text = re.sub('Filename: ./deb', f'Filename: {url}/deb', text)
        text = re.sub('Filename: deb', f'Filename: {url}/deb', text)
        text = re.sub('Filename: debs', f'Filename: {url}/debs', text)
        text = re.sub('Filename: api', f'Filename: {url}/api', text)
        text = re.sub('Filename: pool', f'Filename: {url}/pool', text)
        text = re.sub('Filename: files', f'Filename: {url}/files', text)
    lol.seek(0)
    lol.write(text.replace('�', ' '))
    lol.truncate()
final_data = {
'url': f'{url}',
'icon': f'https://assets.dynastic.co/brand/img/icons/apple-touch-icon.png',
'app': [],
}
app = {}
with open(f'{filepath}') as csvfile:
    data = csv.reader(csvfile, delimiter=':')
    for line in data:
        if len(line) == 0:
            final_data['app'].append(app)
            app = {}
            continue
        try:
            if line[1].strip() in ['http', 'https']:
                line[1] = line[1] + ':' + line[2]
        except:
            pass
        try:
             app[line[0]] = line[1].strip()
        except:
             app[line[0]] = line[0].strip()
      
json_string = json.dumps(final_data)
with open(f'/root/PackageFinderJS/repos/Dynastic.json', 'w') as f:
    dat = json.dumps(final_data, indent=4)
    f.write(dat)
    f.close()
