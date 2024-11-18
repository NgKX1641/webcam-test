import { Component, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css'],
})
export class CameraComponent {
  public triggerObservable: Subject<void> = new Subject<void>();
  public videoWidth = 330;
  public videoHeight = 160;
  public videoOptions: MediaTrackConstraints = {
    width: { ideal: this.videoWidth },
    height: { ideal: this.videoHeight },
  };

  public capturedImage: string | null = null;

  // Zoom level (dynamically adjustable)
  public zoomLevel = 2; // Default zoom level

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

  // Optionally, you can change the zoom level based on screen orientation
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateZoom();
  }

  updateZoom() {
    const isPortrait = window.innerHeight > window.innerWidth;
    this.zoomLevel = isPortrait ? 2 : 1.5;  // Example: adjust zoom based on orientation
  }
}
