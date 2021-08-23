import { GoogleLogin, GoogleLoginInterface } from "./Google/GoogleLogin"
import { WebDriverFactory } from "./Chrome/ChromeWebDriver"
import { DownloadFile } from "./Chrome/DownloadFile"
import { JobcanOperation } from "./Jobcan/JobcanOperation"
import { JobcanLogin } from "./Jobcan/JobcanLogin"
import { getLogger } from "./Log/GetLogger"
import { AttendanceRecord } from "./Csv/AttendanceRecord"
import { DateTime } from "luxon"
import config from "config"
import path from "path"
import fs from "fs"
import { initLogger } from "./Log/LogInitializer"

initLogger()
const log = getLogger()

async function workFlow(year: number, month: number) {
  const downloadFileInstance = new DownloadFile(
    "fileDownload",
    path.join(process.cwd(), "fileDownload"),
    new WebDriverFactory()
  )

  // ログイン処理
  const jobcanLoginData: GoogleLoginInterface = {
    driver: downloadFileInstance.driver,
    id: config.get<string>("Google.id"),
    pw: config.get<string>("Google.pw")
  }
  const jobcanUrl = config.get<string>("Jobcan.url")
  const webDriverActionData = {
    driver: jobcanLoginData.driver,
    url: jobcanUrl
  }
  downloadFileInstance.deleteDirectory(path.join(process.cwd(), "fileDownload"))
  downloadFileInstance.makeDirectory(path.join(process.cwd(), "fileDownload"))

  await new JobcanLogin(jobcanLoginData, jobcanUrl).login()
  const jobcanOperation = new JobcanOperation(webDriverActionData)
  await jobcanOperation.openAttendanceRecord()
  await jobcanOperation.DownloadAttendanceRecordCsv(year, month)

  // ファイルがダウンロードできるまで待つ
  await jobcanLoginData.driver.sleep(5000)

  const attendanceRecordFileName = fs.readdirSync(
    path.join(process.cwd(), "fileDownload")
  )

  console.log(attendanceRecordFileName)

  if (!attendanceRecordFileName) {
    log.error("Not found: attendanceRecordFileName")
    throw new Error()
  }
  const attendanceRecord = new AttendanceRecord(
    attendanceRecordFileName[0],
    path.join(process.cwd(), "fileDownload", attendanceRecordFileName[0])
  ).getAll()
  log.debug(attendanceRecord)
  // .catch((e) => {
  //   log.debug(
  //     `ジョブカンの操作がうまくいきませんでした: ${JSON.stringify({
  //       error: e
  //     })}`
  //   )
  //   throw new Error()
  // })

  // ブラウザ閉じる
  // await jobcanLoginData.driver.close()
  // await jobcanLoginData.driver.quit()
}
workFlow(Number(process.argv[2]), Number(process.argv[3]))
