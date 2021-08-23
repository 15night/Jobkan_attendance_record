import { ExtractData } from "./ExtractData"

export interface AttendanceRecordParameter {
  date: string
  holidayDivision: string
  shiftStartTime: string
  shiftEndTime: string
  workStartTime: string
  workEndTime: string
  workingHours: string
  overtime: string
  midnightWork: string
  breakTime: string
  attendanceStatus: string
  error: string
}

export class AttendanceRecord extends ExtractData<AttendanceRecordParameter> {
  getAll(): Array<AttendanceRecordParameter> {
    return this.list
  }

  protected isSameId(obj: AttendanceRecordParameter, id: number): boolean {
    return this.list[id] === obj
  }

  protected convertFromRow(row: Array<string>): AttendanceRecordParameter {
    return {
      date: row[0],
      holidayDivision: row[1],
      shiftStartTime: row[2],
      shiftEndTime: row[3],
      workStartTime: row[4],
      workEndTime: row[5],
      workingHours: row[6],
      overtime: row[7],
      midnightWork: row[8],
      breakTime: row[9],
      attendanceStatus: row[10],
      error: row[11]
    }
  }
}
