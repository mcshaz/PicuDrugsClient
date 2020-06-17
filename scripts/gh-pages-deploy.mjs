import execa from 'execa';
import { existsSync } from 'fs';

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
    let exitCode = 0;
    try {
        await execa("git", ["checkout", "--orphan", "gh-pages"]);
        console.log("Building...");
        await execa("yarn", ["run", "build-staging"]);
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
        await execa("git", ["checkout", "-f", "master"]);
        await execa("git", ["branch", "-D", "gh-pages"]);
    }
	process.exit(exitCode);
})();
