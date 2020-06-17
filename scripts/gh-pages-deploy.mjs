import execa from 'execa';
import { promises, existsSync } from 'fs';

(async () => {
    try {
        await execa("git", ["update-index", "--refresh"]); 
        const { stdout } = await execa("git", ["diff-index", "HEAD"]);
        if (stdout) {
            console.log("Please stash or commit changes first!");
            process.exit(1);
        }
    } catch (e) {
        console.log(e.message);
        process.exit(1);
    }
    const configFilePath = "vue.config.js";
    const fileOpts = {encoding: 'utf-8'};
    let config = await promises.readFile(configFilePath, fileOpts);
    const originPublicPath = "publicPath: '/'";
    await promises.writeFile(configFilePath, config.replace(originPublicPath, "publicPath: '/PicuDrugsClient/'"), fileOpts);
    let exitCode = 0;
    try {
        await execa("git", ["checkout", "--orphan", "gh-pages"]);
        console.log("Building...");
        await execa("yarn", ["run", "build-modern"]);
        // Understand if it's dist or build folder
        const folderName = existsSync("dist") ? "dist" : "build";
        await execa("git", ["--work-tree", folderName, "add", "--all"]);
        await execa("git", ["--work-tree", folderName, "commit", "-m", "gh-pages"]);
        console.log("Pushing to gh-pages...");
        await execa("git", ["push", "origin", "HEAD:gh-pages", "--force"]);
        const rmCmd = process.platform === "win32"
            ? "del"
            : "rm";
        await execa(rmCmd, ["-r", folderName]);
        console.log("Successfully deployed");
    } catch (e) {
        console.log(e.message);
        exitCode = 1;
    } finally {
        await promises.writeFile(configFilePath, originPublicPath, fileOpts);
        await execa("git", ["checkout", "-f", "master"]);
        await execa("git", ["branch", "-D", "gh-pages"]);
    }
	process.exit(exitCode);
})();
