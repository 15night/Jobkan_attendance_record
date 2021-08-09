import { GoogleLogin, GoogleLoginInterface } from "./Google/GoogleLogin"
import { WebDriverFactory } from "./Chrome/ChromeWebDriver"
import { DownloadFile } from "./Chrome/downloadFile"
import { JobcanLogin } from "./Jobcan/JobcanLogin"
import { getLogger } from "./Log/GetLogger"
import config from "config"
import path from "path"

const log = getLogger()

async function workFlow() {
  const downloadFileInstance = new DownloadFile(
    "fileDownload",
    path.join(process.cwd(), "fileDownload"),
    new WebDriverFactory()
  )

  // ログイン処理
  const JobcanLoginData: GoogleLoginInterface = {
    driver: downloadFileInstance.driver,
    id: config.get<string>("google.id"),
    pw: config.get<string>("google.pw")
  }
  const jobcanUrl = config.get<string>("Jobcan.Url")

  await new JobcanLogin(JobcanLoginData, jobcanUrl).login()
}
workFlow()
