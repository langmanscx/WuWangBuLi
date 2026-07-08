/* tslint:disable:no-unused-variable */
import { , ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ThreeSphereComponent } from './three.sphere.component';

describe('Sphere.3dComponent', () => {
  let component: ThreeSphereComponent;
  let fixture: ComponentFixture<ThreeSphereComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ ThreeSphereComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeSphereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
