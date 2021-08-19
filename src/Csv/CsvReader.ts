import fs from "fs"
import csvSync from "csv-parse/lib/sync"
import parse from "csv-parse"
import iconv from "iconv-lite"

export class CsvReader {
  private path: string

  constructor(path: string) {
    this.path = path
    this._existFile()
  }

  read(
    options: parse.Options,
    sjisFlag: boolean = false
  ): Array<Array<string>> {
    if (sjisFlag) {
      return csvSync(
        iconv.decode(Buffer.from(fs.readFileSync(this.path)), "SHIFT_JIS"),
        options
      )
    }

    return csvSync(fs.readFileSync(this.path, "utf8"), options)
  }

  private _existFile() {
    if (!fs.existsSync(this.path)) {
      console.error(`${this.path} のファイルが存在しません`)
      throw new Error()
    }
  }
}
