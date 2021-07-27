import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StartupService } from '../services/startup.service';

@Injectable()
export class InitSuccessGuard implements CanActivate {

  constructor(
    private startup: StartupService,
    private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    console.log('InitSuccessGuard canActivate');
    if (this.startup.initError) {
      this.router.navigateByUrl('/unavailable');
      return false;
    }
    return true;
  }
}

@Injectable()
export class InitErrorGuard implements CanActivate {

  constructor(
    private startup: StartupService,
    private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    console.log('InitErrorGuard canActivate');
    if (!this.startup.initError) {
      this.router.navigateByUrl('/');
      return false;
    }
    return true;
  }
}
