import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarManuComponent } from './sidebar-manu.component';

describe('SidebarManuComponent', () => {
  let component: SidebarManuComponent;
  let fixture: ComponentFixture<SidebarManuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarManuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarManuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
