/*
This script query htb public API to determine the status of the machines
to know if I can remove the draft status or not yet.

You should only make public the machines already retired

This script makes use of the env var HTB_API_TOKEN
*/
const { globSync } = require('glob');
const fs = require('node:fs');
const request = require('sync-request');
const FgRed = "\x1b[31m"
const FgGreen = "\x1b[32m"

const WRITE_UP_PATH = "docs/Hacking/Write-ups/Hack\\ the\\ box/*"

const extractMachineData = () => {
    const extractName = (path) => { const sp = path.split("/"); return sp[sp.length - 1] }
    const machinePaths = globSync(`${WRITE_UP_PATH}/*`)
    const machineMap = {}

    for (const machinePath of machinePaths) {
        machineMap[extractName(machinePath)] = machinePath
    }
    return machineMap
}

const writeupPath = (machineName, machinePath) => machinePath + "/" + machineName + ".md"

const isDraft = (writeUpPath) => fs.readFileSync(writeUpPath, 'utf8').includes("draft: true")

const isMachineRetiredInHtb = (machineName) => {
    const url = `https://www.hackthebox.com/api/v4/machine/profile/${machineName}`
    const response = request('GET', url, {
        headers: {
            "Authorization": `Bearer ${process.env.HTB_API_TOKEN}`
        }
    })
    return JSON.parse(response.getBody('utf8'))["info"]["retired"] == 1
}

console.log("Checking status of machines with htb public API ...")
const machineData = extractMachineData()
for (const machineName of Object.keys(machineData)) {
    const machinePath = machineData[machineName]
    const machineWriteupPath = writeupPath(machineName, machinePath)
    const isRetired = isMachineRetiredInHtb(machineName)
    const isWriteUpDraft = isDraft(machineWriteupPath)

    if (isRetired && isWriteUpDraft) {
        console.log(FgGreen, `You can remove the draft status in ${machineWriteupPath}`)
    }

    if (!isRetired && !isWriteUpDraft) {
        console.log(FgRed, `The write-up in ${machineWriteupPath} must be in draft mode`)
        process.exit(1)
    }
}
