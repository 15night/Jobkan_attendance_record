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
        throw new Error()
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
      .catch(() => {
        throw new Error()
      })

    await this.click(By.css(jobcanCssSelector.clickAttendanceRecord)).catch(
      () => {
        throw new Error()
      }
    )
  }

  async DownloadAttendanceRecordCsv(year: number, month: number) {
    console.log(`${year}年${month}月のCSVをダウンロードします`)

    // 年入力
    await this.click(By.xpath(`//option[@value='${year}']`)).catch(() => {
      throw new Error()
    })
    //  月入力
    await this.click(By.xpath(`//option[@value='${month}']`)).catch(() => {
      throw new Error()
    })

    await this.click(By.css(jobcanCssSelector.choiceCsv)).catch((e) => {
      throw new Error()
    })
    await this.click(By.css(jobcanCssSelector.clickDownloadButton)).catch(
      () => {
        throw new Error()
      }
    )
  }
}
