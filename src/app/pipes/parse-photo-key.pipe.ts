import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

/**
 * A pipe that transforms a photo key into a full CDN URL.
 * If the photo key is empty, it returns an empty string.
 */
@Pipe({
  name: 'parsePhotoKey'
})
export class ParsePhotoKeyPipe implements PipeTransform {

  /**
   * Transforms a photo key into a full CDN URL.
   * @param photo_key - The photo key to transform.
   * @returns The full CDN URL if the photo key is valid, otherwise an empty string.
   */
  transform(photo_key: string): string {
    return photo_key.length < 1 ? "" : `${environment.cdn}/${photo_key}`
  }

}
