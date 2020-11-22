
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
url = sys.argv[2]
print(f"Downloading repo for {url}!")
try:
    os.mkdir(f"{os.getcwd()}/repos")
    os.mkdir(f"{os.getcwd()}/data")
except:
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

with open(f'/root/PackageFinderJS/repos/{sys.argv[1]}.json', 'w') as f:
    dat = json.dumps(final_data, indent=4)
    f.write(dat)
    f.close()
    print("Done!")

with open('f/root/PackageFinderJS/repo_updaters/{sys.argv[1]}.json', 'w') as f:
    f.write(f"import random\nimport os\nimport csv\nimport json\nimport shutil\nimport time\nimport bz2\nimport sys\nimport smtplib\nfrom subprocess import Popen\nimport re\nimport requests\nurl = sys.argv[2]\nprint(f'Downloading repo for {url}!')\ntry:\n    os.mkdir(f'{os.getcwd()}/repos')\n    os.mkdir(f'{os.getcwd()}/data')\nexcept:\n    pass\ntry:\n    headers={\n        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'\n    }\n    r = requests.get(f'{url}/Packages.bz2', headers=headers)\nexcept Exception as e:\n    print('Is this a repo?')\n    sys.exit(1)\nwith open(f'{os.getcwd()}/data/Packages.bz2', 'wb') as f:\n    f.write(r.content)\ntry:\n    zipfile = bz2.BZ2File('./data/Packages.bz2')\n    data = zipfile.read()\nexcept:\n    a = Popen(f'bzip2 -d ./data/Packages.bz2', shell=True)\n    while a is not None:\n            retcode = a.poll()\n            if retcode is not None:\n                print('Unzipped!')\n                data = open(f'{os.getcwd()}/data/Packages').read()\n                break\n    else:\n            time.sleep(1)\nfilepath = f'{os.getcwd()}//data/repo.csv'\nopen(filepath, 'wb').write(data)\nwith open(filepath, 'r+', errors='ignore') as lol:\n    try:\n        text = lol.read()\n    except Exception as e:\n        print(f'Error {e} occurred')\n    if re.search('/\ ', url):\n        text = re.sub('Filename: ./debs', f'Filename: {url}debs', text)\n        text = re.sub('Filename: ./deb', f'Filename: {url}deb', text)\n        text = re.sub('Filename: deb', f'Filename: {url}deb', text)\n        text = re.sub('Filename: debs', f'Filename: {url}debs', text)\n        text = re.sub('Filename: api', f'Filename: {url}api', text)\n        text = re.sub('Filename: pool', f'Filename: {url}pool', text)\n        text = re.sub('Filename: files', f'Filename: {url}files', text)\n    else:\n        text = re.sub('Filename: ./debs', f'Filename: {url}/debs', text)\n        text = re.sub('Filename: ./deb', f'Filename: {url}/deb', text)\n        text = re.sub('Filename: deb', f'Filename: {url}/deb', text)\n        text = re.sub('Filename: debs', f'Filename: {url}/debs', text)\n        text = re.sub('Filename: api', f'Filename: {url}/api', text)\n        text = re.sub('Filename: pool', f'Filename: {url}/pool', text)\n        text = re.sub('Filename: files', f'Filename: {url}/files', text)\n    lol.seek(0)\n    lol.write(text.replace('\0', ' '))\n    lol.truncate()\nfinal_data = {\n'url': f'{url}',\n'icon': f'{url}/CydiaIcon.png',\n'app': [],\n}\napp = {}\nwith open(f'{filepath}') as csvfile:\n    data = csv.reader(csvfile, delimiter=':')\n    for line in data:\n        if len(line) == 0:\n            final_data['app'].append(app)\n            app = {}\n            continue\n        try:\n            if line[1].strip() in ['http', 'https']:\n                line[1] = line[1] + ':' + line[2]\n        except:\n            pass\n        try:\n             app[line[0]] = line[1].strip()\n        except:\n             app[line[0]] = line[0].strip()\n      \njson_string = json.dumps(final_data)\nwith open(f'/root/PackageFinderJS/repos/{sys.argv[1]}.json', 'w') as f:\n    dat = json.dumps(final_data, indent=4)\n    f.write(dat)\n    f.close()\n    print('Done!')"
    f.close()
    os.system(f"git add repo_updaters && git commit -m \"Added {sys.argv[1]} repo!\" && git push")
