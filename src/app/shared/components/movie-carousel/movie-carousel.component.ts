import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import Swiper from 'swiper';
import { OnDestroy } from '@angular/core';
import { IVideoContent } from '../../models/video-content.interface';
import { animate, style, transition, trigger } from '@angular/animations';
import { DescriptionPipe} from '../../pipes/description.pipe';
import { ImagePipe } from '../../pipes/image.pipe';
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-movie-carousel',
  standalone: true,
  imports: [CommonModule,DescriptionPipe, ImagePipe],
  templateUrl: './movie-carousel.component.html',
  styleUrl: './movie-carousel.component.scss',
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(300, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class MovieCarouselComponent implements OnInit, AfterViewInit, OnChanges ,OnDestroy {
  @Input() title!: string;
  @Input() videoContents: IVideoContent[] = [];
  
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  isLoading = true;
  selectedContent: string | null = null;
  private swiper: Swiper | undefined;

  constructor() { }

  ngOnInit() {
    this.isLoading = true;
    if (this.videoContents.length > 0) {
      this.initSwiper();
    }
    this.isLoading = false;
  }

  ngAfterViewInit(): void {
    if (!this.swiper && this.videoContents.length > 0) {
      this.initSwiper();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['videoContents'] && !changes['videoContents'].firstChange) {
      this.updateSwiper();
    }
  }




  private initSwiper() {
    setTimeout(() => {
      if (this.swiperContainer && this.swiperContainer.nativeElement) {
        const swiperOptions = {
        slidesPerView: 3,
        slidesPerGroup: 2,
        centeredSlides: true,
        loop: this.videoContents.length >= 12, // Enable loop only if there are enough slides
        loopedSlides: this.videoContents.length,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          600: {
            slidesPerView: 2,
            slidesPerGroup: 1,
            spaceBetween: 5,
            centeredSlides: true,
          },
          900: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 5,
            centeredSlides: true,
          },
          1200: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 5,
            centeredSlides: false,
          },
          1500: {
            slidesPerView: 5,
            slidesPerGroup: 5,
            spaceBetween: 5,
            centeredSlides: false,
          },
          1800: {
            slidesPerView: 5,
            slidesPerGroup: 6,
            spaceBetween: 5,
            centeredSlides: false,
          }
        }
      };

      this.swiper = new Swiper(this.swiperContainer.nativeElement, swiperOptions);
    } else {
      console.warn('Swiper container not found');
    }
    }, 0);
  }
  updateSwiper() {
    if (this.swiper) {
      this.swiper.destroy();
    }
    this.initSwiper();
  }

  setSelectedContent(content: IVideoContent) {
    this.selectedContent = content?.title || content?.name || null;
  }

  clearSelectedContent() {
    this.selectedContent = null;
  }
  ngOnDestroy() {
    if (this.swiper) {
      this.swiper.destroy();
    }
  }
}