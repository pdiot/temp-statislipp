import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EnrichedGameFile } from 'src/interfaces/outputs';
import { TourButton } from 'src/interfaces/tour';
import { FileOpenerService } from 'src/services/fileInteraction/file-opener.service';
import { StoreService } from 'src/services/store/store.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, AfterViewInit {

  private fileList: File[];

  constructor(private fileOpener: FileOpenerService, private storeService: StoreService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (!(localStorage.getItem('upload-tour') === 'complete')) {
      const buttons: TourButton[] = [
        {
          label: 'OK',
          click: () => {
            localStorage.setItem('upload-tour', 'complete');
            this.storeService.resetTour();
          }
        }
      ];
      this.storeService.setMultipleTour([
        {
          key: 'title',
          data: 'Welcome to Statislipp !'
        },
        {
          key: 'text',
          data: 'First, choose some .slp files to upload'
        },
        {
          key: 'buttons',
          data: buttons
        },
        {
          key: 'show',
          data: true
        }
      ]);
    }
  }

  onChange(event) {
    console.log('On Change: event', event);
    this.fileList = event.target.files;
    this.getEnrichedGameFiles();
  }

  onDrop(event) {
    event.stopPropagation();
    event.preventDefault();
    this.fileList = event.dataTransfer.files;
    this.getEnrichedGameFiles();    
  }

  onDrag(event) {
    console.log('On drag');
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffet = 'copy';
  }

  getEnrichedGameFiles() {
    const promises = this.fileList.map(async (file) => {
        try {
          const enrichedGameFile = this.fileOpener.readFileAsSlippiGame(file)
        }
        catch(err) {

        }
    });
  }

}
