import { JobcanCssSelector } from "./JobcanCssSelector"
import {
  CommonWebDriverAction,
  CommonWebDriverActionInterface
} from "../Chrome/CommonWebDriverAction"
import { By, until, Key } from "selenium-webdriver"
import { getLogger } from "../Log/GetLogger"

const log = getLogger()
const jobcanCssSelector = new JobcanCssSelector()

export class JobcanOperation extends CommonWebDriverAction {
  constructor(commonWebDriverActionEntity: CommonWebDriverActionInterface) {
    super(commonWebDriverActionEntity)
  }

  async openAttendanceRecord() {
    const a = await this.driver.getWindowHandle()
    console.log(a)
    await this.click(By.css(jobcanCssSelector.clickAttendanceMenu))
    await this.driver
      .wait(
        async () => (await this.driver.getAllWindowHandles()).length === 2,
        10000
      )
      .catch((e) => {
        throw e
      })

    //   Chromedriver操作下にあるタブを移動
    const windows = await this.driver.getAllWindowHandles()
    await this.driver.switchTo().window(windows[1])

    await this.driver
      .wait(
        async () =>
          this.elementLocated(jobcanCssSelector.clickAttendanceRecord),
        10000
      )
      .catch((e) => {
        throw e
      })

    await this.click(By.css(jobcanCssSelector.clickAttendanceRecord)).catch(
      (e) => {
        throw e
      }
    )
  }

  async DownloadAttendanceRecordCsv(year: number, month: number) {
    console.log(`${year}年${month}月のCSVをダウンロードします`)
    // TODO yearとmonthのプルダウン選択できるようにする
    // selenium のTypeScriptのselect使えない

    // await this.click(By.css(jobcanCssSelector.yearPullDown))
    // await this.driver.findElement()
    // await this.driver
    //   .findElement(By.xpath(`//*[@id="mid61165871931bd"]/option[${year}]`))
    //   .click()
    // await this.click(By.id(jobcanCssSelector.monthPullDown))
    // await this.driver.findElement()
    // await this.driver
    //   .findElement(By.xpath(`//*[@id="mid61165871931bd"]/option[${month}]`))
    //   .click()
    // await this.pullDownInput(
    //   By.id("mid61165871931bd"),
    //   By.css(jobcanCssSelector.yearPullDown),
    //   `${year}`
    // )
    // console.log(`//*[@id="mid61165871931bd"]/option[@value="${year}"]`)
    // await this.pullDownInput(
    //   By.id("yid6116587193118"),
    //   By.css(jobcanCssSelector.monthPullDown),
    //   `${month}`
    // )
    await this.click(By.css(jobcanCssSelector.choiceCsv)).catch((e) => {
      throw e
    })
    await this.click(By.css(jobcanCssSelector.clickDownloadButton)).catch(
      (e) => {
        throw e
      }
    )
  }
}
