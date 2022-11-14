import fetch from 'node-fetch';
import * as fs from 'fs';
import * as util from 'util';
import * as stream from 'stream';
import * as Bunzip from 'seek-bzip';
import * as debianCtrl from 'debian-control';
import {ActivityType} from 'discord.js';
const streamPipeline = util.promisify(stream.pipeline);
const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'
}

async function logError(error) {
    await new Promise((resolve) => {
        if(fs.existsSync("./errors.txt") == false) {
            fs.writeFileSync("./errors.txt","[ Packager Error Log]\n\n");
        }
        fs.appendFileSync("./errors.txt",`[${Date().toString()}]: `+error+"\n");
        resolve();
    });

} 

export async function LoadJSON(client) {
        const repos = JSON.parse(fs.readFileSync("./src/repos.json"))
        for (var repo in repos) {
            console.log("Updating repo: " + repo)
            await RepoUpdater(repo,repos[repo]);
        }
        
        console.log("Reading jsons...");
        for (const file of fs.readdirSync("./repos")) {
            const json = JSON.parse(fs.readFileSync(`./repos/${file}`, "utf8"));
            json.name = file.replace(".json", "").replace(/-/g, ' ').replace(/:/g, '/').replace(/\'/g, "'");
            client.jsons.set(file, json);
        }
    
        client.packageCount = 0
        client.jsons.forEach(repo => {  
            client.packageCount += repo.app.length
        })
    
        client.user.setPresence({ activities: [{ name: `${client.packageCount.toLocaleString()} packages`, type: ActivityType.Watching}] });
    
}
export async function RepoUpdater(repoName,repoURL) {
    let skip = false;
    try {
        fs.rmSync("./data",{recursive:true,force:true});
    } catch(e) {
        console.log("[ ERROR ] : Data directory didn't exist. Logged to errors.txt");
        logError(e);
    }
    fs.mkdirSync("./data");
    try {
        const response = await fetch(repoURL+"/Packages", {
            headers: headers
        })
        await streamPipeline(response.body,fs.createWriteStream("./data/repo.pkgs"));
        skip = true
    } catch (e) {
        // Not procursus, so skip.
        skip = false
    }
    if (skip == false) {
        try {
            const response = await fetch(repoURL+"/Packages.bz2", {
                headers: headers
            })
            await streamPipeline(response.body,fs.createWriteStream("./data/Packages.bz2"));

        } catch (e) {
            console.log(`[ ERROR ]: Repo ${repoName} had an error downloading the BZ2. Logged to errors.txt`);
            logError(e);
            return false;
        }
        // Unzip BZ2
        try {
            var compressedData = fs.readFileSync("./data/Packages.bz2")
            var decompressed = Bunzip.default.decode(compressedData);
            fs.writeFileSync("./data/repo.pkgs", decompressed);
        } catch (e) {
            console.log("[ ERROR ]: Couldn't unzip BZ2. Logged to errors.txt");
            logError(e);
            return false
        }
    } 
    // Now that the BZ2 has been decompressed to pkgs, we need to read those pkgs
    let pkgs = fs.readFileSync("./data/repo.pkgs").toString();
    pkgs = pkgs.replace('Filename: ./debs', `Filename: ${repoURL}debs`)
    pkgs = pkgs.replace('Filename: ./deb', `Filename: ${repoURL}deb`)
    pkgs = pkgs.replace('Filename: deb', `Filename: ${repoURL}deb`)
    pkgs = pkgs.replace('Filename: debs', `Filename: ${repoURL}debs`)
    pkgs = pkgs.replace('Filename: api', `Filename: ${repoURL}api`)
    pkgs = pkgs.replace('Filename: pool', `Filename: ${repoURL}pool`)
    pkgs = pkgs.replace('Filename: files', `Filename: ${repoURL}files`)
    pkgs = pkgs.replace('Filename: ./debs', `Filename: ${repoURL}/debs`)
    pkgs = pkgs.replace('Filename: ./deb', `Filename: ${repoURL}/deb`)
    pkgs = pkgs.replace('Filename: deb', `Filename: ${repoURL}/deb`)
    pkgs = pkgs.replace('Filename: debs', `Filename: ${repoURL}/debs`)
    pkgs = pkgs.replace('Filename: api', `Filename: ${repoURL}/api`)
    pkgs = pkgs.replace('Filename: pool', `Filename: ${repoURL}/pool`)
    pkgs = pkgs.replace('Filename: files', `Filename: ${repoURL}/files`)
    pkgs = pkgs.replace('�', ' ');
    const final_data = {
        'url': repoURL,
        'icon': `${repoURL}/CydiaIcon.png`,
        'app': []
    }
    // Parse that control file.
    const packages = pkgs.split(/(\n\n)/g).filter((p) => p.trim());
    for (var pkgzs in packages) {
        let parsedData = debianCtrl.parse(packages[pkgzs]);
        final_data.app.push(parsedData);
    }
    fs.writeFileSync("./repos/"+repoName+".json", JSON.stringify(final_data,null,2));
    return true;
}
