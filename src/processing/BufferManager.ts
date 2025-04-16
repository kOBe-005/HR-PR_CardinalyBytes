import { MethodConfig, ROI } from '../types/core';
import { Frame } from './Frame';
import { Buffer } from './Buffer';
import { FrameBuffer } from './FrameBuffer';
import { RGBBuffer } from './RGBBuffer';

/**
 * Manages multiple FrameBuffers for handling different ROIs and method configurations.
 */
export class BufferManager {
  private buffers: Map<string, { buffer: Buffer; createdAt: number }>;
  private state: Float32Array | null = null;

  constructor() {
    this.buffers = new Map();
  }

  /**
   * Generates a unique buffer ID based on ROI.
   * @param roi - The ROI associated with the buffer.
   * @returns A unique buffer ID string.
   */
  private generateBufferId(roi: ROI): string {
    return `${roi.x0},${roi.y0},${roi.x1},${roi.y1}`;
  }

  /**
   * Adds a new buffer for a given ROI and method configuration.
   * @param roi - The ROI for the new buffer.
   * @param methodConfig - The method config.
   * @param timestamp - The current timestamp.
   */
  addBuffer(roi: ROI, methodConfig: MethodConfig, timestamp: number): void {
    const id = this.generateBufferId(roi);
    if (!this.buffers.has(id)) {
      let newBuffer: Buffer;
      if (methodConfig.method === 'vitallens') {
        newBuffer = new FrameBuffer(roi, methodConfig);
      } else {
        newBuffer = new RGBBuffer(roi, methodConfig);
      }
      this.buffers.set(id, { buffer: newBuffer, createdAt: timestamp });
    }
  }

  /**
   * Checks if there is a managed buffer which is ready for processing.
   * @returns True if the buffer has enough frames, false otherwise.
   */
  isReady(): boolean {
    return this.getReadyBuffer() != null;
  }

  /**
   * Retrieves the most recent buffer that is ready for processing.
   * @returns The ready buffer or null if none are ready.
   */
  private getReadyBuffer(): Buffer | null {
    let readyBuffer: Buffer | null = null;
    let timestamp = 0;
    const hasState = this.state !== null;

    for (const { buffer, createdAt } of this.buffers.values()) {
      if (hasState) {
        if (buffer.isReadyState() && createdAt > timestamp) {
          readyBuffer = buffer;
          timestamp = createdAt;
        }
      } else {
        if (buffer.isReady() && createdAt > timestamp) {
          readyBuffer = buffer;
          timestamp = createdAt;
        }
      }
    }

    this.cleanupBuffers(timestamp);

    return readyBuffer;
  }

  /**
   * Adds a frame to the active buffers.
   * @param frame - The frame to add.
   * @param overrideRoi - Use this ROI instead of buffer ROI (optional).
   */
  async add(frame: Frame, overrideRoi?: ROI): Promise<void> {
    for (const { buffer } of this.buffers.values()) {
      buffer.add(frame, overrideRoi);
    }
  }

  /**
   * Consumes frames from the newest ready buffer.
   * @returns The merged Frame or null if no buffer is ready.
   */
  async consume(): Promise<Frame | null> {
    const readyBuffer = this.getReadyBuffer();
    return readyBuffer ? readyBuffer.consume() : Promise.resolve(null);
  }

  /**
   * Cleans up buffers that are older than the given timestamp.
   * @param timestamp - The current timestamp.
   */
  private cleanupBuffers(timestamp: number): void {
    this.buffers.forEach(({ createdAt, buffer }, id) => {
      if (createdAt < timestamp) {
        buffer.clear();
        this.buffers.delete(id);
      }
    });
  }

  /**
   * Check if this manager has no buffers.
   * @returns True if this manager has no buffers.
   */
  isEmpty(): boolean {
    return this.buffers.size === 0;
  }

  /**
   * Clears all buffers, resets the manager and state.
   */
  cleanup(): void {
    for (const { buffer } of this.buffers.values()) {
      buffer.clear(); // Clear and release all frames in the buffer
    }
    this.buffers.clear();
    this.state = null;
  }

  /**
   * Sets the recurrent state.
   * @param state - The new state to set.
   */
  setState(state: Float32Array): void {
    this.state = state;
  }

  /**
   * Reset the recurrent state to null.
   */
  resetState(): void {
    this.state = null;
  }

  /**
   * Gets the current recurrent state.
   * @returns The current state.
   */
  getState(): Float32Array | null {
    return this.state;
  }
}
