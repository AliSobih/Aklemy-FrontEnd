import { Component, Input, OnInit } from '@angular/core';
import { CertificateService } from '@services/certificate.service';
import { Certificate } from '@common/certificate';
import { User } from '@common/user';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TranslateModule } from '@ngx-translate/core';
import { SecondsToTimePipe } from "../../../../../../../common/pipe/secods-to-time.pipe";

@Component({
  selector: 'app-certificate',
  standalone: true,

  imports: [CommonModule, TranslateModule, SecondsToTimePipe],
  templateUrl: './certificate.component.html',
  styleUrl: './certificate.component.scss',
})
export class CertificateComponent implements OnInit {
  certificate?: Certificate;
  private user: User = new User();

  courseid?: number;
  @Input() usrName?: string;
  @Input() instructorName: string = 'Instructor Name';

  constructor(
    private certificateService: CertificateService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.courseid = params['id'];
      console.log('courseid', this.courseid);
    });
    this.loadCertificate();
  }

  loadCertificate() {
    let certificate = new Certificate(this.courseid!, this.user.id);
    console.log('certificate', certificate);

    this.certificateService.getUsercertificate(certificate).subscribe({
      next: (data) => {
        console.log('data', data);
        this.certificate = data;
      },
      error: (err) => {
        console.error(err);
        console.log('error', err);
      },
    });
  }

  generatePDF() {
    setTimeout(() => {
      const data = document.getElementById('certificate');
      if (data) {
        html2canvas(data, { scale: 2, scrollY: 0 }).then((canvas) => {
          const imgWidth = 148; // Width of A5 in mm
          const pageHeight = 20; // Height of A5 in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          let pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [800, 553],
          });

          const contentDataURL = canvas.toDataURL('image/png');
          pdf.addImage(contentDataURL, 'PNG', 0, 0, 800, 553); // تعديل الأبعاد وفقًا للحجم المخصص

          pdf.save(`${this.certificate?.courseName}.pdf`);

          let position = 0;

          let heightLeft = imgHeight;
          while (heightLeft >= 0) {
            pdf.addImage(
              contentDataURL,
              'PNG',
              0,
              position,
              imgWidth,
              imgHeight
            );
            heightLeft -= pageHeight;
            position += pageHeight;
            if (heightLeft > 0) {
              pdf.addPage();
            }
          }

          pdf.save(`${this.certificate?.courseName}.pdf`);
        });
      } else {
        console.error('Element with id "certificate" not found.');
      }
    }, 1000); // Wait for 1 second
  }
}
