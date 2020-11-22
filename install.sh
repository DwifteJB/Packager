echo "ooga booha update"
rm -r ./*
git clone -b test https://github.com/DwifteJB/PackageFinderJS update
mv update/* ./
rm -r update
npm i discord.js shelljs hastebin-gen
chmod +x update.sh
chmod +x install.sh
node .
