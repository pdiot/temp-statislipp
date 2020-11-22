import { TestBed } from '@angular/core/testing';

import { SlippiFilesService } from './slippi-files.service';

describe('SlippiFilesService', () => {
  let service: SlippiFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlippiFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
