import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

/**
 * A pipe that transforms a Unix timestamp into a human-readable time format.
 * It calculates the difference between the current time and the provided timestamp,
 * and returns a formatted string based on the time difference.
 */
@Pipe({
  name: 'parsePostTimestamp'
})
export class ParsePostTimestampPipe implements PipeTransform {

  /**
   * Transforms a Unix timestamp into a human-readable time format.
   * @param created_at - The Unix timestamp to transform.
   * @returns A formatted string representing the time difference:
   * - If more than 1 day has passed, returns the date in "MMM do YY" format (e.g., "Jan 1st 23").
   * - If more than 1 hour has passed, returns the number of hours ago (e.g., "2h ago").
   * - Otherwise, returns the number of minutes ago (e.g., "15m ago").
   */
  transform(created_at: number): string {
    const unixMoment = moment(created_at);
    const timeDifference = moment.duration(moment().diff(unixMoment));

    if (timeDifference.asDays() >= 1)
      return unixMoment.format("MMM do YY");

    if (timeDifference.asHours() >= 1)
      return `${timeDifference.asHours().toFixed(0)}h ago`;

    return `${timeDifference.asMinutes().toFixed(0)}m ago`;
  }
}
