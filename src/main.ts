import { GoogleLogin, GoogleLoginInterface } from "./Google/GoogleLogin"
import { WebDriverFactory } from "./Chrome/ChromeWebDriver"
import { DownloadFile } from "./Chrome/DownloadFile"
import { JobcanOperation } from "./Jobcan/JobcanOperation"
import { JobcanLogin } from "./Jobcan/JobcanLogin"
import { getLogger } from "./Log/GetLogger"
import { DateTime } from "luxon"
import config from "config"
import path from "path"

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
