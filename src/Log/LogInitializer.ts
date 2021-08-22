import log4js from "log4js"
import { DateTime } from "luxon"
import config from "config"

export interface SlackParam {
  token?: string
  channel_id?: string
  username?: string
}

function getSlackParamFromConfig(): SlackParam | undefined {
  if (config.has("developer.slack.token")) {
    return {
      token: config.get<string>("developer.slack.token"),
      channel_id: config.get<string>("developer.slack.channelId"),
      username: config.get<string>("developer.slack.userName")
    }
  } else {
    return undefined
  }
}

export function initLogger(slackParam?: SlackParam) {
  const _slackParam = slackParam ?? getSlackParamFromConfig()
  if (_slackParam) {
    log4js.configure({
      appenders: {
        out: {
          type: "stdout"
        },
        file: {
          type: "file",
          filename: `./log/process_${DateTime.local().toFormat(
            "yyyyMMdd"
          )}.log`,
          alwaysIncludePattern: true,
          keepFileExt: true
        },
        slack: {
          type: "@log4js-node/slack",
          token: _slackParam.token,
          channel_id: _slackParam.channel_id,
          username: _slackParam.username
        },
        overInfo: {
          type: "logLevelFilter",
          appender: "slack",
          level: "error"
        }
      },
      categories: {
        default: {
          appenders: ["out", "file", "overInfo"],
          level: "debug"
        }
      }
    })
  } else {
    console.log("Log setting for slack not found!")
    log4js.configure({
      appenders: {
        out: {
          type: "stdout"
        },
        file: {
          type: "file",
          filename: `./log/process_${DateTime.local().toFormat(
            "yyyyMMdd"
          )}.log`,
          alwaysIncludePattern: true,
          keepFileExt: true
        }
      },
      categories: {
        default: {
          appenders: ["out", "file"],
          level: "debug"
        }
      }
    })
  }
}
