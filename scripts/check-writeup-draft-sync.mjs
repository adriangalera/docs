import axios from "axios";
import * as glob from "glob"
import fs from "node:fs"

const WRITE_UP_PATH = "docs/Hacking/Write-ups/Hack\\ the\\ box/Machines/*/*"
const FgRed = "\x1b[31m"
const FgGreen = "\x1b[32m"


const extractMachineData = () => {
  const extractName = (path) => { const sp = path.split("/"); return sp[sp.length - 1].replace(".md", "") }
  const machinePaths = glob.globSync(`${WRITE_UP_PATH}/*`)
  const machineMap = {}
  for (const machinePath of machinePaths) {
    const machineName = extractName(machinePath)
    machineMap[machineName] = machinePath
  }
  return machineMap
}

const writeupPath = (machineName, machinePath) => machinePath

const isDraft = (writeUpPath) => fs.readFileSync(writeUpPath, 'utf8').includes("draft: true")

/**
 * Check if an HTB machine is retired.
 * @param {string} machineName - The name of the machine (case-insensitive).
 * @returns {Promise<boolean|null>} - true if retired, false if active, null if not found.
 */
async function isMachineRetired(machineName) {
  const baseUrl = `https://www.hackthebox.com/machines/${machineName.toLowerCase()}`;

  try {
    const response = await axios.get(baseUrl);
    if (response.data.includes("Content Locked")) {
      return false
    }
    return true
  } catch (err) {
    // If the machine is not found, assume it's retired
    console.log(`Cannot check machine status for ${machineName}. Error: ${err} on url ${baseUrl}`)
    return true
  }
}

(async () => {

  console.log("Checking status of HTB machines ...")
  const machineData = extractMachineData()
  for (const machineName of Object.keys(machineData)) {
    const machinePath = machineData[machineName]
    const machineWriteupPath = writeupPath(machineName, machinePath)
    const isWriteUpDraft = isDraft(machineWriteupPath)
    const isRetired = await isMachineRetired(machineName)

    if (isRetired && isWriteUpDraft) {
      console.log(FgGreen, `You can remove the draft status in ${machineWriteupPath}`)
    }

    if (!isRetired && !isWriteUpDraft) {
      console.log(FgRed, `The write-up in ${machineWriteupPath} must be in draft mode`)
      process.exit(1)
    }
  }
})();
