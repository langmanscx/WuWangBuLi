/* tslint:disable:no-unused-variable */
import { , ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ThreePlaneComponent } from './three.plane.component';

describe('Plane.3dComponent', () => {
  let component: ThreePlaneComponent;
  let fixture: ComponentFixture<ThreePlaneComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ ThreePlaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreePlaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
