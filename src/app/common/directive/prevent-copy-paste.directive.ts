import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPreventCopyPaste]',
  standalone: true, // اجعل الديركتف standalone
})
export class PreventCopyPasteDirective {
  @HostListener('copy', ['$event'])
  handleCopy(event: ClipboardEvent) {
    event.preventDefault();
    alert('Copying text is disabled.');
  }

  @HostListener('cut', ['$event'])
  handleCut(event: ClipboardEvent) {
    event.preventDefault();
    alert('Cutting text is disabled.');
  }
}
