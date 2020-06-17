import execa from 'execa';
import rimraf from 'rimraf';
import { promisify } from 'util';

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
    const promrmrf = promisify(rimraf);
    let exitCode = 0;
    try {
        await execa("git", ["checkout", "--orphan", "gh-pages"]);
        console.log("Building...");
        await execa("yarn", ["run", "build-staging"]);
        const folderName = "dist";
        await execa("git", ["--work-tree", folderName, "add", "--all"]);
        await execa("git", ["--work-tree", folderName, "commit", "-m", "gh-pages"]);
        console.log("Pushing to gh-pages...");
        await execa("git", ["push", "origin", "HEAD:gh-pages", "--force"]);
        console.log("deleting files");
        await promrmrf(folderName, { glob: false })
        console.log("Successfully deployed");
    } catch (e) {
        console.log(e.message);
        exitCode = 1;
    } finally {
        await execa("git", ["checkout", "-f", "master"]); // git checkout -f master
        await execa("git", ["branch", "-D", "gh-pages"]); // git branch -D gh-pages
    }
	process.exit(exitCode);
})();
