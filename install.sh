echo "ooga booha update"
rm -r ./*
git clone https://github.com/DwifteJB/PackageFinderJS update
mv update/* ./
rm -r update
npm i discord.js shelljs
chmod +x update.sh
chmod +x install.sh
node .
