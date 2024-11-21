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

  // Captured images
  public capturedImage: string | null = null; // Full image
  public zoomedImage: string | null = null; // Cropped image

  // Zoom level (dynamically adjustable)
  public zoomLevel = 3; // Default zoom level

  // Capture image
  captureImage(): void {
    this.triggerObservable.next();
  }

  // Handle captured image
  onImageCapture(webcamImage: WebcamImage): void {
    this.capturedImage = webcamImage.imageAsDataUrl;

    // Crop the image to zoomed area
    this.cropToZoomedArea(webcamImage.imageAsDataUrl);
  }

  private cropToZoomedArea(imageDataUrl: string): void {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) return;

    const image = new Image();
    image.src = imageDataUrl;

    image.onload = () => {
        const videoWidth = image.width;
        const videoHeight = image.height;

        const isPortrait = window.innerHeight > window.innerWidth;
        const zoomFactor = 2;

        const visibleWidth = isPortrait
            ? videoWidth / zoomFactor
            : 330 / zoomFactor;
        const visibleHeight = isPortrait
            ? 160 / zoomFactor
            : videoHeight / zoomFactor;

        const cropX = videoWidth - visibleWidth;
        const cropY = videoHeight - visibleHeight;

        canvas.width = 330;
        canvas.height = 160;

        context.save();
        context.scale(-1, 1);
        context.drawImage(
            image,
            cropX, cropY, visibleWidth, visibleHeight,
            -canvas.width, 0, canvas.width, canvas.height
        );
        context.restore();

        this.zoomedImage = canvas.toDataURL('image/png');
    };
  }

  // Handle webcam initialization errors
  handleInitError(error: WebcamInitError): void {
    console.error('Webcam initialization error:', error);
  }

  // Optionally, you can change the zoom level based on screen orientation
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.zoomLevel = 3
  }
}
