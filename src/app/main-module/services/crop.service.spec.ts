import { TestBed, inject } from '@angular/core/testing';

import { CropService } from './crop.service';

describe('CropService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CropService]
    });
  });

  it('should ...', inject([CropService], (service: CropService) => {
    expect(service).toBeTruthy();
  }));
});
