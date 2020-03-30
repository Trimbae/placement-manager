import { TestBed } from '@angular/core/testing';

import { MsGraphService } from './ms-graph.service';

describe('MsGraphService', () => {
  let service: MsGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
