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
#print(os.getcwd())
url = sys.argv[2]
try:
    shutil.rmtree(f"./data/")
    os.mkdir(f"./data/")
except:
    os.mkdir(f"./data/")
    pass
try:
    headers={
        "X-Machine": "iPhone13,4",
        "X-Firmware": "15.0",
        "Proxy-Connection": "keep-alive",
        "Cache-Control": "max-age=0",
        "User-Agent": "Telesphoreo APT-HTTP/1.0.592",
        "X-Unique-ID": "9a756301-fcbf-43f2-af7c-1eb0dc2c0c2a",
        "Connection": "keep-alive"
    }
    if url == "http://apt.thebigboss.org/repofiles/cydia/" or url == "http://apt.thebigboss.org/repofiles/cydia":
        r = requests.get(f"http://apt.thebigboss.org/repofiles/cydia/dists/stable/main/binary-iphoneos-arm/Packages.bz2", headers=headers)
    elif url == "http://apt.modmyi.com/" or url == "http://apt.modmyi.com":
        r = requests.get(f"http://apt.modmyi.com/dists/stable/main/binary-iphoneos-arm/Packages.bz2", headers=headers)
    elif url == "http://cydia.zodttd.com/repo/cydia/" or url == "http://cydia.zodttd.com/repo/cydia":
        r = requests.get(f"http://cydia.zodttd.com/repo/cydia/dists/stable/main/binary-iphoneos-arm/Packages.bz2", headers=headers)
    else:
        r = requests.get(f"{url}/Packages.bz2", headers=headers)
except Exception as e:
    print("Is this a repo?")
    sys.exit(1)
with open(f'{os.getcwd()}/data/Packages.bz2', 'wb') as f:
    f.write(r.content)
try:
    zipfile = bz2.BZ2File("./data/Packages.bz2")
    data = zipfile.read()
except:
    a = Popen(f"bzip2 -d ./data/Packages.bz2", shell=True)
    while a is not None:
            retcode = a.poll()
            if retcode is not None:
                print("Unzipped!")
                data = open(f"{os.getcwd()}/data/Packages").read()
                break
    else:
            time.sleep(1)

filepath = f"./data/repo.csv"
open(filepath, 'wb').write(data)
with open(filepath, 'r+', errors='ignore') as lol:
    try:
        text = lol.read()
    except Exception as e:
        print(f"Error {e} occurred")
    if url == "http://apt.thebigboss.org/repofiles/cydia/dists/stable/main/binary-iphoneos-arm/" or url == "http://apt.thebigboss.org/repofiles/cydia/dists/stable/main/binary-iphoneos-arm/" or url == "http://apt.thebigboss.org/repofiles/cydia/" or url == "http://apt.thebigboss.org/repofiles/cydia":
        text = re.sub('Filename: debs2.0/', f'Filename: http://apt.thebigboss.org/repofiles/cydia/debs2.0/', text)
    elif url == "http://apt.modmyi.com/dists/stable/main/binary-iphoneos-arm/" or url == "http://apt.modmyi.com/dists/stable/main/binary-iphoneos-arm" or url == "http://apt.modmyi.com/" or url == "http://apt.modmyi.com":
        text = re.sub('Filename: pool/main/', f'Filename: http://apt.modmyi.com/pool/main/', text)
    elif url == "http://cydia.zodttd.com/repo/cydia/dists/stable/main/binary-iphoneos-arm/" or url == "http://cydia.zodttd.com/repo/cydia/dists/stable/main/binary-iphoneos-arm" or url == "http://cydia.zodttd.com/repo/cydia/" or url == "http://cydia.zodttd.com/repo/cydia":
        text = re.sub('Filename: pool/main/', f'Filename: http://cydia.zodttd.com/repo/cydia/pool/main/', text)
    elif re.search('/\ ', url):
        text = re.sub('Filename: ./debs', f'Filename: {url}debs', text)
        text = re.sub('Filename: ./deb', f'Filename: {url}deb', text)
        text = re.sub('Filename: ./pkg', f'Filename: {url}pkg', text)
        text = re.sub('Filename: deb', f'Filename: {url}deb', text)
        text = re.sub('Filename: debs', f'Filename: {url}debs', text)
        text = re.sub('Filename: api', f'Filename: {url}api', text)
        text = re.sub('Filename: pool', f'Filename: {url}pool', text)
        text = re.sub('Filename: files', f'Filename: {url}files', text)
        text = re.sub('Filename: apt', f'Filename: {url}apt', text)
        text = re.sub('Filename: download', f'Filename: {url}download', text)
        text = re.sub('Filename: pkg', f'Filename: {url}pkg', text)
    else:
        text = re.sub('Filename: ./debs', f'Filename: {url}/debs', text)
        text = re.sub('Filename: ./deb', f'Filename: {url}/deb', text)
        text = re.sub('Filename: ./pkg', f'Filename: {url}/pkg', text)
        text = re.sub('Filename: deb', f'Filename: {url}/deb', text)
        text = re.sub('Filename: debs', f'Filename: {url}/debs', text)
        text = re.sub('Filename: api', f'Filename: {url}/api', text)
        text = re.sub('Filename: pool', f'Filename: {url}/pool', text)
        text = re.sub('Filename: files', f'Filename: {url}/files', text)
        text = re.sub('Filename: apt', f'Filename: {url}/apt', text)
        text = re.sub('Filename: download', f'Filename: {url}/download', text)
        text = re.sub('Filename: pkg', f'Filename: {url}/pkg', text)
    lol.seek(0)
    lol.write(text.replace('\0', ' '))
    lol.truncate()

final_data = {
'url': f'{url}',
'icon': f'{url}/CydiaIcon.png',
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

with open(f"./repos/{sys.argv[1]}.json", 'w') as f:
    dat = json.dumps(final_data, indent=4)
    f.write(dat)
    f.close()