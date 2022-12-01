import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import {
  PushNotification,
  PushNotificationActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  PushNotificationToken,
} from '@capacitor/push-notifications';
import { Browser } from '@capacitor/browser';

@Injectable({
  providedIn: 'root',
})
export class FcmService {
  constructor(private router: Router) {}

  // TODO: Update deprecated definitions
  initPush() {
    if (Capacitor.platform !== 'web') {
      this.registerPush();
    }
  }

  openBrowser = async (URL: string) => {
    await Browser.open({ url: URL });
  };

  private registerPush() {
    PushNotifications.requestPermissions().then((permission) => {
      if (permission.receive) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // No permission for push granted
      }
    });

    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        console.log('My token: ' + JSON.stringify(token));
      }
    );

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
    });

    PushNotifications.addListener('pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed',
      async (notification: PushNotificationActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        if (data.detailsId) {
          this.router.navigateByUrl(`/home/${data.detailsId}`);
        } else if (data.customURL) {
          this.openBrowser(data.customURL);
        }
      }
    );
  }
}
