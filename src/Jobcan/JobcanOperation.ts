import { JobcanCssSelector } from "./JobcanCssSelector"
import {
  CommonWebDriverAction,
  CommonWebDriverActionInterface
} from "../Chrome/CommonWebDriverAction"
import { By, until, Key } from "selenium-webdriver"
import { getLogger } from "../Log/GetLogger"

const log = getLogger()

export class JobcanOperation extends CommonWebDriverAction {
  constructor(commonWebDriverActionEntity: CommonWebDriverActionInterface) {
    super(commonWebDriverActionEntity)
  }

  async openAttendanceRecord() {
    const jobcanCssSelector = new JobcanCssSelector()
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
}
