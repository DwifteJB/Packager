
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
url = "http://apt.thebigboss.org/repofiles/cydia/dists/stable/main/binary-iphoneos-arm"
print(f"Downloading repo for {url}!")
try:
    shutil.rmtree(f"{os.getcwd()}/data")
    os.mkdir(f"{os.getcwd()}/data")
except:
    os.mkdir(f"{os.getcwd()}/data")
    pass
try:
    headers={
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'
    }
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

filepath = f"{os.getcwd()}//data/repo.csv"
open(filepath, 'wb').write(data)
with open(filepath, 'r+', errors='ignore') as lol:
    try:
        text = lol.read()
    except Exception as e:
        print(f"Error {e} occurred")
    if re.search('/\ ', url):
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
    lol.write(text.replace('\0', ' '))
    lol.truncate()

final_data = {
'url': f'{url}',
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

os.chdir("../")

with open('BigBoss.json', 'w') as f:
    dat = json.dumps(final_data, indent=4)
    f.write(dat)
    f.close()
    print("Done!")
