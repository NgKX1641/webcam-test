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
  public zoomLevel = 2; // Default zoom level

  public nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  public currentFacingMode: 'user' | 'environment' = 'user';

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

  // Crop image to the zoomed area
  private cropToZoomedArea(imageDataUrl: string): void {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to the zoomed dimensions
    canvas.width = this.videoWidth;
    canvas.height = this.videoHeight;

    const image = new Image();
    image.src = imageDataUrl;

    image.onload = () => {
      // Define cropping area
      const zoomFactor = 3; // Matches the CSS scale factor
      const cropWidth = this.videoWidth / zoomFactor;
      const cropHeight = this.videoHeight / zoomFactor;
      const cropX = (image.width - cropWidth) / 2; // Center crop
      const cropY = (image.height - cropHeight) / 2; // Center crop

      // Draw the zoomed area onto the canvas
      context.drawImage(
        image,
        cropX, cropY, cropWidth, cropHeight, // Source dimensions
        0, 0, this.videoWidth, this.videoHeight // Target dimensions
      );

      // Get the cropped image as Data URL
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
    this.updateZoom();
  }

  updateZoom() {
    const isPortrait = window.innerHeight > window.innerWidth;
    this.zoomLevel = isPortrait ? 2 : 1.5;  // Example: adjust zoom based on orientation
  }

  switchCamera(): void {
    // Toggle between 'user' and 'environment'
    this.currentFacingMode = this.currentFacingMode === 'user' ? 'environment' : 'user';
    this.nextWebcam.next(this.currentFacingMode);
  }
}
