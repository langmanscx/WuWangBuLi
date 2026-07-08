/* tslint:disable:no-unused-variable */
import { , ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ThreeBuildingSphereComponent } from './three.building.sphere.component';

describe('Three.building.sphereComponent', () => {
  let component: ThreeBuildingSphereComponent;
  let fixture: ComponentFixture<ThreeBuildingSphereComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ThreeBuildingSphereComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeBuildingSphereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
