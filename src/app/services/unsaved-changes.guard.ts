import { Injectable } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';

export type CanDeactivateType =
  | Observable<boolean>
  | Promise<boolean>
  | boolean;

export interface CanComponentDeactivate {
  canDeactivate: () => CanDeactivateType;
  hasUnsavedChanges: boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  if (!component.hasUnsavedChanges) {
    return true;
  }

  const deactivateSubject = new Subject<boolean>();
  Swal.fire({
    title: 'Are you sure?',
    text: 'You have unsaved changes. Do you really want to leave?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, leave',
    cancelButtonText: 'No, stay',
  }).then((result) => {
    if (result.isConfirmed) {
      deactivateSubject.next(true);
    } else {
      deactivateSubject.next(false);
    }
  });

  return deactivateSubject.asObservable();
};
