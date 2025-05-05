import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarExamComponent } from './sidebar-exam.component';

describe('SidebarExamComponent', () => {
  let component: SidebarExamComponent;
  let fixture: ComponentFixture<SidebarExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
