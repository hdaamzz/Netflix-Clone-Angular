import { Component, inject, PLATFORM_ID, Inject, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from '../../core/components/header/header.component';
import { BannerComponent } from '../../core/components/banner/banner.component';
import { MovieService } from '../../shared/services/movie.service';
import { MovieCarouselComponent } from '../../shared/components/movie-carousel/movie-carousel.component';
import { IVideoContent } from '../../shared/models/video-content.interface';
import { forkJoin, map, Observable } from 'rxjs';


@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [HeaderComponent, MovieCarouselComponent,BannerComponent,CommonModule],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss'
})
export class BrowseComponent implements OnInit {
  auth = inject(AuthService);
  movieService=inject(MovieService)
  name: string = ''; 
  userProfileImg: string = '';
  email: string =  '';
  bannerDetail$ = new Observable<any>();
  bannerVideo$ = new Observable<any>();


  movies: IVideoContent[] = [];
  tvShows: IVideoContent[] = [];
  ratedMovies: IVideoContent[] = [];
  nowPlayingMovies: IVideoContent[] = [];
  popularMovies: IVideoContent[] = [];
  topRatedMovies: IVideoContent[] = [];
  upcomingMovies: IVideoContent[] = [];


  sources = [
    this.movieService.getMovies(),
    this.movieService.getTvShows(),
    this.movieService.getRatedMovies(),
    this.movieService.getNowPlayingMovies(),
    this.movieService.getUpcomingMovies(),
    this.movieService.getPopularMovies(),
    this.movieService.getTopRated()
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const userData = sessionStorage.getItem('loggedInUser');
      if (userData) {
        const parsedData = JSON.parse(userData);
        this.name = parsedData.name;
        this.userProfileImg = parsedData.picture;
        this.email = parsedData.email;
      }
    }
  }
  ngOnInit(): void {
    forkJoin(this.sources)
      .pipe(
        map(([movies, tvShows, ratedMovies, nowPlaying, upcoming, popular, topRated]) => {
          this.bannerDetail$ = this.movieService.getBannerDetail(movies.results[0].id);
          this.bannerVideo$ = this.movieService.getBannerVideo(movies.results[0].id);
          return {movies, tvShows, ratedMovies, nowPlaying, upcoming, popular, topRated}
        })
      ).subscribe((res: any) => {
        this.movies = res.movies.results as IVideoContent[];
        this.tvShows = res.tvShows.results as IVideoContent[];
        this.ratedMovies = res.ratedMovies.results as IVideoContent[];
        this.nowPlayingMovies = res.nowPlaying.results as IVideoContent[];
        this.upcomingMovies = res.upcoming.results as IVideoContent[];
        this.popularMovies = res.popular.results as IVideoContent[];
        this.topRatedMovies = res.topRated.results as IVideoContent[];
        
        console.log(res.movies);
      });
  }

  signOut() {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem("loggedInUser");
      this.auth.signOut();
    }
  }
}