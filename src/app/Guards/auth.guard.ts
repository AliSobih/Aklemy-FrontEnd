import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  // const token = sessionStorage.getItem('authToken');

    let token = sessionStorage.getItem('authToken');
    if (token == null || token == undefined) {
      token = localStorage.getItem('authToken');
    }
  const router = inject(Router); // Inject the Router service

  if (token) {
    // Decode the JWT token
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));

    // Retrieve the user data from sessionStorage
    // const userDataString = sessionStorage.getItem('authUser');

    let userDataString = sessionStorage.getItem('authUser');
    if (userDataString == null || userDataString == undefined) {
      userDataString = localStorage.getItem('authUser');
    }
    const userData = userDataString ? JSON.parse(userDataString) : null;

    if (userData) {
      // Get the roles required for the route
      const requiredRoles = route.data['role'];
      console.log(route);
      console.log('Required Roles:', requiredRoles);
      console.log('User Role:', userData.role);

      // Check if the user's role matches any of the required roles
      if (requiredRoles.includes(userData.role)) {
        return true; // Allow access
      } else {
        // Redirect to unauthorized page if the roles don't match
        router.navigate(['/unauthorized']);
        return false;
      }
    } else {
      // Redirect to the login page if no user data is available in sessionStorage
      router.navigate(['/login']);
      return false;
    }
  } else {
    // Redirect to the login page if no token is present
    router.navigate(['/login']);
    return false;
  }
};
