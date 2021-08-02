import { until, By } from "selenium-webdriver"
import { GoogleLogin, GoogleLoginInterface } from "../Google/GoogleLogin"

export class JobcanLogin extends GoogleLogin {
  jobcanUrl!: string

  constructor(param: GoogleLoginInterface, url: string) {
    super(param)
    this.jobcanUrl = url
  }
  async login() {
    await this.pushGoogleButton()
    await this.inputId()
    await this.inputPassWord()
    await this.pushPasswordNextButton()
  }

  async pushGoogleButton(): Promise<void> {
    await this.driver.manage().window().maximize()

    const url: string = this.jobcanUrl + "login"
    await Promise.all([
      await this.driver.get(url),
      await (
        await this.driver.wait(
          until.elementLocated(By.css("#new_user_google > a")),
          this.interval30Sec
        )
      ).click()
    ]).catch((e) => {
      this.log.error(e)
      throw new Error()
    })
  }
}
