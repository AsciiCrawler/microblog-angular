import { Pipe, PipeTransform } from '@angular/core';

/**
 * A pipe that extracts a substring from a given string by splitting it at the "#" character.
 * It is designed to handle strings formatted with a delimiter (e.g., "prefix#value").
 * If the input string is invalid or the split operation fails, it returns an empty string.
 */
@Pipe({
  name: 'parseSk'
})
export class ParseSkPipe implements PipeTransform {

  /**
   * Transforms a string by extracting the substring after the "#" character.
   * @param SK - The input string to transform (e.g., "prefix#value").
   * @returns The substring after the "#" character, or an empty string if the input is invalid or the operation fails.
   */
  transform(SK: string): string {
    try {
      return SK.split("#")[1];
    } catch (error) {
      return "";
    }
  }
}
