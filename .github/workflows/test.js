import { RepoUpdater } from "../../src/lib/repoUpdate.js"
const Test = await RepoUpdater("Havoc","https://havoc.app/")
if (Test == true) {
    console.log("test past!")
} else {
    console.error("error lol")
    process.exit(1)
}
