import {Component, Input, OnChanges} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnChanges {
  @Input() sourceData;
  @Input() height;
  url: SafeUrl;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnChanges(): void {
    this.sourceData = this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + this.sourceData);
  }

}
