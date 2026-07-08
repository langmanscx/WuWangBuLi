/* tslint:disable:no-unused-variable */
import { , ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BuildingBoxComponent } from './building.box.component';

describe('Building.boxComponent', () => {
  let component: BuildingBoxComponent;
  let fixture: ComponentFixture<BuildingBoxComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ BuildingBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
