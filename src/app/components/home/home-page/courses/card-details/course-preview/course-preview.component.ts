import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BitrateOptions, VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { CommonModule } from '@angular/common';
import { CourseService } from '@services/course.service';
import { Course } from '@common/course';
import { Constants } from '@common/constants';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '@services/language.service';
import { Subscription } from 'rxjs';
import { SecondsToTimePipe } from "../../../../../../common/pipe/secods-to-time.pipe";

@Component({
  selector: 'app-course-preview',
  standalone: true,
  imports: [
    CommonModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    TranslateModule,
    SecondsToTimePipe
],
  templateUrl: './course-preview.component.html',
  styleUrls: ['./course-preview.component.scss'],
})
export class CoursePreviewComponent implements OnInit, OnDestroy {
  @Input() course?: Course;
  playlist: any[] = [];
  currentIndex = 0;
  activeVideo: any = [];
  path = Constants.COURSE_DOWNLOAD_VIDEO_API;
  private languageSubscription: Subscription | undefined;
  language: string = 'en';

  constructor(
    private courseService: CourseService,
    private languageService: LanguageService
  ) {}

  api!: {
    getDefaultMedia: () => {
      currentTime: number;
      duration(arg0: any, duration: any): any;
      (): any;
      new (): any;
      subscriptions: {
        (): any;
        new (): any;
        loadedMetadata: {
          (): any;
          new (): any;
          subscribe: { (arg0: () => void): void; new (): any };
        };
        ended: {
          (): any;
          new (): any;
          subscribe: { (arg0: () => void): void; new (): any };
        };
      };
    };
    play: () => void;
  };

  dashBitrates?: BitrateOptions[];
  videoQualities: BitrateOptions[] = [
    {
      qualityIndex: 0,
      width: 256,
      height: 144,
      bitrate: 150000,
      label: '144p',
      mediaType: '',
    },
    {
      qualityIndex: 1,
      width: 426,
      height: 240,
      bitrate: 400000,
      label: '240p',
      mediaType: '',
    },
    {
      qualityIndex: 2,
      width: 640,
      height: 360,
      bitrate: 1000000,
      label: '360p',
      mediaType: '',
    },
    {
      qualityIndex: 3,
      width: 854,
      height: 480,
      bitrate: 2000000,
      label: '480p',
      mediaType: '',
    },
    {
      qualityIndex: 4,
      width: 1280,
      height: 720,
      bitrate: 5000000,
      label: '720p',
      mediaType: '',
    },
  ];

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.setupPlaylist();
    this.languageSubscription = this.languageService.languageChanged.subscribe(
      () => {
        this.language = this.languageService.getLanguage() ?? 'en';
      }
    );

  }


  setupPlaylist() {
    if (this.course) {
      this.course.sections.forEach((section) => {
        section.lessons
          .filter((lesson) => {
            return lesson.isVisible;
          })
          .forEach((lesson) => {
            if (lesson.contentURL) {
              this.playlist.push({
                title: lesson.title,
                titleAr: lesson.titleAr,

                src: lesson.contentURL, // Ensure this is defined
                type: 'video/mp4', // Adjust based on your content types
                thumbnail: 'path/to/thumbnail.jpg', // Adjust or dynamically assign thumbnails
                duration: lesson.duration, // Adjust formatting as needed
              });
            }
          });
      });
      if (this.playlist.length > 0) {
        this.activeVideo = this.playlist[this.currentIndex];
      }
    }
  }

  onPlayerSet(api: any) {
    this.api = api;
    this.api
      .getDefaultMedia()
      .subscriptions.loadedMetadata.subscribe(this.startVideo.bind(this));
    this.api
      .getDefaultMedia()
      .subscriptions.ended.subscribe(this.nextVideo.bind(this));
  }

  nextVideo() {
    this.currentIndex++;
    if (this.currentIndex === this.playlist.length) {
      this.currentIndex = 0;
    }
    this.activeVideo = this.playlist[this.currentIndex];
  }

  startVideo() {
    this.api.play();
  }

  onClickPlaylistVideo(
    item: {
      title: string;
      src: string;
      type: string;
      thumbnail: string;
      duration: string;
    },
    index: number
  ) {
    this.currentIndex = index;
    this.activeVideo = item;
  }

  // Add the skip and rewind methods
  skip() {
    const media = this.api.getDefaultMedia();
    media.currentTime = Math.min(
      media.currentTime + 10,
      Number(media.duration)
    );
  }

  rewind() {
    const media = this.api.getDefaultMedia();
    media.currentTime = Math.max(media.currentTime - 10, 0);
  }

  vgDash: any;

  changeQuality(event: BitrateOptions) {
    this.vgDash.setBitrate(event);
  }
  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
  }
}
