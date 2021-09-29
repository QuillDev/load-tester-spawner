import {ChildProcess, exec} from "child_process";
import {readFile} from "fs/promises";
import {Config} from "./types/config";

(async () => {
    const p_list: { process: ChildProcess, content: string }[] = [];

    let config: Config = JSON.parse(await readFile("./config.json", "utf-8"));

    for (let i = 0; i < 6; i++) {
        await (async (i) => {
            const child = exec(`cd ${config.loadTestDir} && ${config.npmPrefix} start`);

            // Add the child process to the list for tracking
            p_list.push({process: child, content: ""});

            // Listen for any response:
            child.stdout.on('data', function (data) {

                console.log(child.pid, data);
                p_list[i].content += data;
            });

            // Listen for any errors:
            child.stderr.on('data', function (data) {
                console.log(child.pid, data);
                p_list[i].content += data;
            });

            // Listen if the process closed
            child.on('close', function (exit_code) {
                console.log('Closed before stop: Closing code: ', exit_code);
            });
        })(i)
    }

})()