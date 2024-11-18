import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css'],
})
export class CameraComponent {
  // Webcam trigger
  public triggerObservable: Subject<void> = new Subject<void>();

  // Video dimensions and options
  public videoWidth = 330;
  public videoHeight = 160;
  public videoOptions: MediaTrackConstraints = {
    width: { ideal: this.videoWidth },
    height: { ideal: this.videoHeight },
  };

  // Captured image
  public capturedImage: string | null = null;

  // Capture image
  captureImage(): void {
    this.triggerObservable.next();
  }

  // Handle captured image
  onImageCapture(webcamImage: WebcamImage): void {
    this.capturedImage = webcamImage.imageAsDataUrl;
  }

  // Handle webcam initialization errors
  handleInitError(error: WebcamInitError): void {
    console.error('Webcam initialization error:', error);
  }
}
