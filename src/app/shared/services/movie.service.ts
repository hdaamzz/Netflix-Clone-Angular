import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface MovieResponse {
  results: any[];
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);
  private baseUrl = 'https://api.themoviedb.org/3';
  private options={
    params: {
      include_adult: 'false',
      include_video: 'true',
      language: 'en-US',
      page: '1',
      sort_by: 'popularity.desc'
    },
    headers:{
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMmM2NWI4NDBhMzA3Njk5ZGRiNzNmNjQxYzhmZjQ4YyIsIm5iZiI6MTcyNDY1MDg1MC45NzQ0OTksInN1YiI6IjY2Y2MxM2QyOWQ2ZTUwN2FjNTFkNzA1YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._IA8Pio6aBgsD_P11nE9ZYBMqIiU2k9fdGbh4CkInrs'
    }
  };

  getMovies(): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.baseUrl}/discover/movie`, this.options);
  }

  getTvShows(): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.baseUrl}/discover/tv`, this.options);
  }

  getRatedMovies(): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.baseUrl}/account/{account_id}/rated/movies`, this.options);
  }

  getBannerImage(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/${id}/images`, this.options);
  }

  getBannerVideo(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/${id}/videos`, this.options);
  }

  getBannerDetail(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/${id}`, this.options);
  }

  getNowPlayingMovies(): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.baseUrl}/movie/now_playing`, this.options);
  }

  getPopularMovies(): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.baseUrl}/movie/popular`, this.options);
  }

  getTopRated(): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.baseUrl}/movie/top_rated`, this.options);
  }

  getUpcomingMovies(): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.baseUrl}/movie/upcoming`, this.options);
  }
  
}
