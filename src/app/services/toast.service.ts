import { Injectable } from '@angular/core';

type ToastType = {
  message: string;
  isError: boolean;
  uuid: string;
};

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public toasts: ToastType[] = [];

  /**
   * Generates a unique UUID.
   * @returns A unique UUID string.
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const random = (Math.random() * 16) | 0;
      const value = c === 'x' ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    });
  }

  /**
   * Creates a new toast message and adds it to the toast array.
   * @param message - The message to display in the toast.
   * @param isError - Indicates whether the toast is an error message. Defaults to false.
   */
  create(message: string, isError: boolean = false): void {
    const uuid = this.generateUUID();
    this.toasts.push({ message, isError, uuid });
    setTimeout(() => this.remove(uuid), 15000);
  }

  /**
   * Deletes a toast message from the toast array by its UUID.
   * @param uuid - The UUID of the toast message to delete.
   */
  remove(uuid: string): void {
    this.toasts = this.toasts.filter((toast) => toast.uuid !== uuid);
  }
}
