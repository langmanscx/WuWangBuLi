/* tslint:disable:no-unused-variable */
import { , ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LineArtViewComponent } from './line.art.component';

describe('Canvas.2d.componentComponent', () => {
  let component: LineArtViewComponent;
  let fixture: ComponentFixture<LineArtViewComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ LineArtViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineArtViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
