import { Injectable } from '@angular/core';
import { AttachedDocument, DownloadFile } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {
  private downloadFile(url: string, name: string): void {
    const dollarIndex = name.indexOf('$') + 1;
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('target', '_blank');
    downloadLink.setAttribute('href', url);
    downloadLink.setAttribute('download', name);
    downloadLink.click();
    downloadLink.remove();
  }

  public downloadAddedFile(doc: File): void {
    const url = window.URL.createObjectURL(doc);
    this.downloadFile(url, doc.name);
  }

  public downloadFileFromUrl(doc: AttachedDocument): void {
    this.downloadFile(doc.fullUrl, doc.fileName);
  }
}