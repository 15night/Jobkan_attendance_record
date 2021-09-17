import { JobcanCssSelector } from "./JobcanCssSelector"
import {
  CommonWebDriverAction,
  CommonWebDriverActionInterface
} from "../Chrome/CommonWebDriverAction"
import { By, until, Key } from "selenium-webdriver"
import { getLogger } from "../Log/GetLogger"
import { DateTime } from "luxon"
import config from "config"

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
      .catch((e) => {
        throw e
      })

    await this.click(By.css(jobcanCssSelector.clickAttendanceRecord)).catch(
      (e) => {
        throw e
      }
    )
  }

  async inputAttendanceRecord(year: number, month: number) {
    await this.click(By.css(jobcanCssSelector.clickDownloadButton)).catch(
      () => {
        throw new Error()
      }
    )
    // 年入力
    await this.click(By.xpath(`//option[@value='${year}']`)).catch((e) => {
      throw e
    })
    //  月入力
    await this.click(By.xpath(`//option[@value='${month}']`)).catch((e) => {
      throw e
    })
    const days = await this.driver.findElements(
      By.xpath("//div[@id='search-result']/table/tbody/tr")
    )

    let isUpdateRow = false

    for (const day of days) {
      const soRodoJikan = await day.findElement(By.xpath("td[2]")).getText()
      const kosuGoukei = await day.findElement(By.xpath("td[3]")).getText()
      let monthDate = await day.findElement(By.xpath("td[1]")).getText()
      monthDate = monthDate.substring(0, monthDate.indexOf("("))

      if (soRodoJikan === "00:00") {
        // 出勤なし
        continue
      }
      if (soRodoJikan === kosuGoukei) {
        // 適切に入力済み
        continue
      }
      // 編集ボタンおしてダイアログ表示
      await day.findElement(By.xpath("td[4]/div")).click()
      await this.driver.wait(until.elementLocated(By.id("edit-menu-title")))
      await this.driver.wait(until.elementLocated(By.name("template")))

      const totalMinutes =
        Number(soRodoJikan.split(":")[0]) * 60 +
        Number(soRodoJikan.split(":")[1])
      const date = DateTime.local(
        DateTime.local().year,
        Number(monthDate.split("/")[0]),
        Number(monthDate.split("/")[1])
      )

      await this.driver.wait(until.elementLocated(By.id("save")))

      const project = config.get<string>("Jobcan.project")
      const task = config.get<string>("Jobcan.task")

      const addRow = async () => {
        const tasks = this.driver.findElement(
          By.xpath("//div[@id='edit-menu-contents']/table/tbody")
        )
        // Rowを追加
        const addButton = await tasks.findElement(
          By.xpath(
            "//div[@id='edit-menu-contents']/table/tbody/tr[1]/td[5]/span[@class='btn jbc-btn-outline-primary']"
          )
        )
        await addButton.click()
        await this.driver
          .findElement(
            By.xpath(
              `//div[@id='edit-menu-contents']/table/tbody/tr[last()]/td[2]//option[text()='${project}']`
            )
          )
          .click()
        await this.driver
          .findElement(
            By.xpath(
              `//div[@id='edit-menu-contents']/table/tbody/tr[last()]/td[3]//option[text()='${task}']`
            )
          )
          .click()
        return await this.driver.findElement(
          By.xpath("//div[@id='edit-menu-contents']/table/tbody/tr[last()]")
        )
      }

      const leftMinutes = totalMinutes - 60
      // Rowを追加
      const row = await addRow()
      const inputText =
        ("" + Math.floor(leftMinutes / 60)).padStart(2, "0") +
        ":" +
        ("" + (leftMinutes % 60)).padStart(2, "0")
      const input = row.findElement(By.xpath("td[4]/input"))
      await input.sendKeys(inputText)

      // フォーカスを外さないと保存ボタンが有効化しないので適当な要素をフォーカス
      await this.driver
        .findElement(
          By.xpath("//div[@id='edit-menu-contents']/table/tbody//tr[1]")
        )
        .click()
      // 保存
      const saveButton = this.driver.findElement(By.id("save"))

      await saveButton.click()
      isUpdateRow = true
      break
    }

    // 保存をクリックするとページがリフレッシュされるので、
    // 再度同じ処理を行う
    if (isUpdateRow) {
      this.inputAttendanceRecord(year, month)
    }
  }
}
