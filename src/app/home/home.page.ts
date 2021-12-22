import { Component } from '@angular/core';
// You may import any optional interfaces
import BackgroundGeolocation, {
  State,
  Config,
  Location,
  LocationError,
  Geofence,
  HttpEvent,
  MotionActivityEvent,
  ProviderChangeEvent,
  MotionChangeEvent,
  GeofenceEvent,
  GeofencesChangeEvent,
  HeartbeatEvent,
  ConnectivityChangeEvent,
} from 'cordova-background-geolocation-lt';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor() {
    this.configureBackgroundGeolocation();
  }

  // Like any Cordova plugin, you must wait for Platform.ready() before referencing the plugin.
  configureBackgroundGeolocation() {


    BackgroundGeolocation.watchPosition((location) => {
      console.log(`[watchPosition] -  ${Date.now}`, location);
    }, (errorCode) => {
      console.log(`[watchPosition] ERROR - ${Date.now}`, errorCode);
    }, {
      interval: 60000,
      persist: true,
      extras: {foo: "bar"},
      timeout: 120000,
      
    });


    // 1.  Listen to events.
    BackgroundGeolocation.onLocation((location) => {
      console.log('[location] - ', location);
    });

    BackgroundGeolocation.onMotionChange((event) => {
      console.log('[motionchange] - ', event.isMoving, event.location);
    });


    BackgroundGeolocation.ready({desiredAccuracy: 0, distanceFilter: 50}).then(state => {
      console.log('- BackgroundGeolocation is ready: ', state);
    }).catch(error => {
      console.log('- BackgroundGeolocation error: ', error);
    });

    BackgroundGeolocation.onHttp((response) => {
      console.log(
        '[http] - ',
        response.success,
        response.status,
        response.responseText
      );
    });

    BackgroundGeolocation.onProviderChange((event) => {
      console.log(
        '[providerchange] - ',
        event.enabled,
        event.status,
        event.gps
      );
    });

    // 2.  Configure the plugin with #ready
    BackgroundGeolocation.ready(
      {
        reset: true,
        debug: true,
        preventSuspend: true,
        disableStopDetection: true,
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 10,
        url: 'http://my.server.com/locations',
        autoSync: true,
        stopOnTerminate: false,
        startOnBoot: true,
      },
      (state) => {
        console.log('[ready] BackgroundGeolocation is ready to use');
        if (!state.enabled) {
          // 3.  Start tracking.
          BackgroundGeolocation.start();
        }
      }
    );
  }
}
