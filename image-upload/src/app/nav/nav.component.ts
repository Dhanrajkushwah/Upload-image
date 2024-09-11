import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  cartItems: any[] = []; // Array to hold cart items
  wishItems: any[] = [];
  images: any;
  isDropdownOpen = false;
  isDropdownVisible = false;
  private isAuthenticated = false; 
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  constructor(private cartService: CartService,private elementRef: ElementRef,private router: Router) { }

  ngOnInit(): void {
    this.isAuthenticated = !!localStorage.getItem('userToken');
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation(); // Prevent click event from propagating to document
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target) && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }
  logout(): void {
    localStorage.removeItem('userToken'); // Remove token from localStorage
    this.isAuthenticated = false;
    this.router.navigate(['/login']); // Navigate to the login page or homepage
  }
}
