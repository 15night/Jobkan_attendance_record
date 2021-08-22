import { CsvReader } from "./CsvReader"
import { getLogger } from "../Log/GetLogger"

export abstract class ExtractData<T> {
  protected log = getLogger()

  protected list: Array<T>

  constructor(
    protected fileName: string,
    path: string,
    protected sjisFlag: boolean = false
  ) {
    this.list = this.importFile(path)
  }

  findById(id: number): T | undefined {
    return this.find((o) => this.isSameId(o, id))
  }
  protected abstract isSameId(obj: T, id: number): boolean

  find(equals: (obj: T) => boolean): T | undefined {
    return this.list.find(equals)
  }

  filter(equals: (obj: T) => boolean): Array<T> {
    const o = this.list.filter(equals)
    if (!o) throw new Error(`${this.fileName} not found`)
    return o
  }

  protected abstract convertFromRow(row: Array<string>): T

  protected importFile(path: string): Array<T> {
    const rows = new CsvReader(path).read(
      {
        from_line: 2,
        bom: true
      },
      this.sjisFlag
    )
    this.log.debug(`${this.fileName}: ${rows.length}件 読み込みました`)
    return rows.map((r: Array<string>) => this.convertFromRow(r))
  }
}
