import { Component, inject, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private router = inject(Router);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Wait for the Google script to load
      this.loadGoogleSignIn();
    }
  }

  private loadGoogleSignIn(): void {
    // Check if google script is loaded
    if (typeof google !== 'undefined' && google.accounts) {
      this.initializeGoogleSignIn();
    } else {
      // If not loaded, wait and try again
      window.setTimeout(() => {
        this.loadGoogleSignIn();
      }, 100);
    }
  }

  private initializeGoogleSignIn(): void {
    google.accounts.id.initialize({
      client_id: '904813243355-b88si90ihcib3a2v96b2isqj2ra6finr.apps.googleusercontent.com',
      callback: (response: any) => {
        this.handleLogin(response);
      }
    });

    // Make sure the element exists before trying to render the button
    const googleBtnElement = document.getElementById('google-btn');
    if (googleBtnElement) {
      google.accounts.id.renderButton(
        googleBtnElement,
        { theme: 'filled_blue', size: 'large', shape: 'rectangle', width: 250 }
      );
    }
  }

  private decodeToken(token: string) {
    return JSON.parse(atob(token.split(".")[1]))
  }

  handleLogin(response: any) {
    if (response) {
      const payLoad = this.decodeToken(response.credential)
      if (isPlatformBrowser(this.platformId)) {
        sessionStorage.setItem("loggedInUser", JSON.stringify(payLoad));
      }
      this.router.navigate(['browse'])
    }
  }
}