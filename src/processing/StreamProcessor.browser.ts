import { StreamProcessorBase } from './StreamProcessor.base';
import { Frame } from './Frame';
import {
  checkFaceInROI,
  checkROIValid,
  getROIForMethod,
} from '../utils/faceOps';

export class StreamProcessor extends StreamProcessorBase {
  private faceDetectionRequestId: number = 0;

  /**
   * Triggers face detection on a single frame.
   * @param frame - Current frame to detect face in.
   * @param currentTime - Timestamp in seconds.
   */
  protected triggerFaceDetection(frame: Frame, currentTime: number): void {
    if (!this.faceDetectionWorker) {
      throw new Error('Face detection worker does not exist.');
    }

    this.isDetecting = true;

    // Create a plain object that contains all data needed to reconstruct the Frame.
    const transferableData = frame.toTransferable();
    const requestId = this.faceDetectionRequestId++;
    const transferables: Transferable[] = [];

    // Ensure the rawData (an ArrayBuffer) is transferred.
    if (transferableData.rawData) {
      transferables.push(transferableData.rawData);
    }

    this.faceDetectionWorker.postMessage(
      {
        id: requestId,
        data: transferableData,
        dataType: 'frame',
        fs: 1, // Not used
        timestamp: currentTime,
      },
      transferables
    );

    // Release the frame immediately (its transferable data has been sent).
    frame.release();
  }

  /**
   * Handles worker responses with face detection results.
   * @param event - The detection event.
   */
  protected handleFaceDetectionResult(event: MessageEvent): void {
    const { id, detections, probeInfo, timestamp, error } = event.data;
    if (error) {
      console.error(`Face detection error (id: ${id}):`, error);
      return;
    }
    if (!detections || detections.length < 1) {
      // No face detected.
      this.roi = null;
      this.pendingRoi = null;
      this.bufferManager.cleanup();
      this.onNoFace();
      return;
    }
    // Use the first detection
    const det = detections[0];
    const shouldUpdateROI =
      checkROIValid(det) &&
      (this.roi === null ||
        (this.options.method === 'vitallens' &&
          !checkFaceInROI(det, this.roi, [0.6, 1.0])) ||
        this.options.method !== 'vitallens');

    if (shouldUpdateROI) {
      const newRoi = getROIForMethod(
        det,
        this.methodConfig,
        { height: probeInfo.height, width: probeInfo.width },
        true
      );
      this.pendingRoi = newRoi;
      if (this.bufferManager.isEmpty() || this.options.method === 'vitallens') {
        this.bufferManager.addBuffer(newRoi, this.methodConfig, timestamp);
      }
    }

    this.lastFaceDetectionTime = timestamp;
    this.isDetecting = false;
  }
}
