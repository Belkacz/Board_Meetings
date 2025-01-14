import { Injectable } from '@angular/core';
import { AttachedDocument, DownloadFile } from '../shared/interfaces';
import { PopUpService } from './pop-up.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {

  constructor(private popUpService: PopUpService,private http: HttpClient){}

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
    // const allowedTypes = [
    //   '.pdf', '.doc', '.docx', '.odt', '.ods', '.odp', '.md', '.txt', '.xtml', '.json', '.yaml','.log',
    //   '.epub', '.gif', '.jpg', '.png', '.bmp', '.svg'
    // ];
    
    // if (!allowedTypes.includes(doc.type)) {
    //   this.popUpService.showPopUp("Not allowed file format");
    //   return;
    // } else 
    // {
      const url = window.URL.createObjectURL(doc);
      this.downloadFile(url, doc.name);
    // }
  }

  public downloadFileFromUrl(doc: AttachedDocument): void {
    console.log(doc.fullUrl)
    this.http.get(doc.fullUrl, { responseType: 'blob' }).subscribe((blob: Blob) => {
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = doc.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl); // Zwolnienie zasobów URL
    }, error => {
      console.error('Error downloading file:', error);
    });
  }
}