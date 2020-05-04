import { TestBed } from '@angular/core/testing';

import { MsGraphService } from './ms-graph.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('MsGraphService', () => {
  let service: MsGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(MsGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
