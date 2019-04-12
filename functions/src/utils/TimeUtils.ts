import * as moment from "moment";
import * as momentTimezone from "moment-timezone";

class TimeUtils {
  static readonly PATTERN_TIME_HUMAN = "HH:mm";
  static readonly PATTERN_DATE_TIME_HUMAN = "D.M.YYYY HH:mm";
  static readonly PATTERN_DATE_HUMAN = "D.M.YYYY";
  static readonly PATTERN_DATE_TIME_HUMAN_SHORT = "D.M. HH:mm";
  static readonly PATTERN_DATE_TIME_API = "YYYY-MM-DD HH:mm:ss";
  static readonly PATTERN_DATE_TIME_DB = "YYYY-MM-DDTHH:mm:ssZ";

  static readonly TIMEZONE_PRAGUE = "Europe/Prague";

  static momentTz: momentTimezone.Moment = momentTimezone;

  static init() {
    moment.locale("cs");
    momentTimezone.tz.setDefault(TimeUtils.TIMEZONE_PRAGUE);
  }
}

export { TimeUtils };
