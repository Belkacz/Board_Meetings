import { Injectable } from '@angular/core';
import { DownloadFile } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {
  downloadFile(doc: DownloadFile): void {
    const downloadLink = document.createElement('a');
    downloadLink.href = doc.fileUrl;
    downloadLink.download = doc.name;
    downloadLink.click();
  }
}