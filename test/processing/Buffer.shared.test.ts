/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Buffer } from '../../src/processing/Buffer';
import { Frame } from '../../src/processing/Frame';
import { MethodConfig, ROI } from '../../src/types/core';

// Mock Buffer class since it's abstract
class MockBuffer extends Buffer {
  protected async preprocess(
    frame: Frame,
    keepTensor: boolean
  ): Promise<Frame> {
    // Mock preprocessing: return the frame as-is
    return frame;
  }
}

describe('Buffer', () => {
  let buffer: MockBuffer;
  let roi: ROI;
  let methodConfig: MethodConfig;

  beforeEach(() => {
    roi = { x0: 0, y0: 0, x1: 100, y1: 100 };
    methodConfig = {
      method: 'pos',
      inputSize: 40,
      fpsTarget: 30,
      roiMethod: 'face',
      minWindowLength: 3,
      maxWindowLength: 5,
      requiresState: false,
      bufferOffset: 1,
    };
    buffer = new MockBuffer(roi, methodConfig);
  });

  afterEach(() => {
    buffer.clear();
  });

  test('adds frames to the buffer and retains them on add()', async () => {
    const rawData = new Int32Array([1, 2, 3]).buffer;
    const frame = new Frame({
      rawData,
      keepTensor: false,
      shape: [1, 1, 3],
      dtype: 'int32',
      timestamp: [1000],
    });
    await buffer.add(frame);
    expect(buffer.isReady()).toBe(false);
    expect((buffer as any).buffer.size).toBe(1);
  });

  test('adds frames to the buffer and retains them with overrideRoi on add()', async () => {
    const rawData = new Int32Array([1, 2, 3]).buffer;
    const frame = new Frame({
      rawData,
      keepTensor: false,
      shape: [1, 1, 3],
      dtype: 'int32',
      timestamp: [1000],
    });
    await buffer.add(frame, roi);
    expect(buffer.isReady()).toBe(false);
    expect((buffer as any).buffer.size).toBe(1);
  });

  test('buffer isReady() when minimum frames are added', async () => {
    for (let i = 0; i < methodConfig.minWindowLength; i++) {
      const rawData = new Int32Array([i, i + 1, i + 2]).buffer;
      const frame = new Frame({
        rawData,
        keepTensor: false,
        shape: [1, 1, 3],
        dtype: 'int32',
        timestamp: [i * 1000],
      });
      await buffer.add(frame);
    }

    expect(buffer.isReady()).toBe(true);
  });

  test('maintains buffer size within maxWindowLength', async () => {
    for (let i = 0; i < 7; i++) {
      const rawData = new Int32Array([i, i + 1, i + 2]).buffer;
      const frame = new Frame({
        rawData,
        keepTensor: false,
        shape: [1, 1, 3],
        dtype: 'int32',
        timestamp: [i * 1000],
      });
      await buffer.add(frame);
    }

    expect((buffer as any).buffer.size).toBe(methodConfig.maxWindowLength);
  });

  test('returns and clears frames beyond minWindowLength on consume()', async () => {
    for (let i = 0; i < 5; i++) {
      const rawData = new Int32Array([i, i + 1, i + 2]).buffer;
      const frame = new Frame({
        rawData,
        keepTensor: false,
        shape: [1, 1, 3],
        dtype: 'int32',
        timestamp: [i * 1000],
      });
      await buffer.add(frame);
    }

    const consumedFrames = await buffer.consume();
    expect(consumedFrames!.getShape()[0]).toBe(methodConfig.maxWindowLength);
    expect((buffer as any).buffer.size).toBe(methodConfig.minWindowLength - 1);
  });

  test('empties the buffer on clear()', async () => {
    for (let i = 0; i < 3; i++) {
      const rawData = new Int32Array([i, i + 1, i + 2]).buffer;
      const frame = new Frame({
        rawData,
        keepTensor: false,
        shape: [1, 1, 3],
        dtype: 'int32',
        timestamp: [i * 1000],
      });
      await buffer.add(frame);
    }

    buffer.clear();
    expect((buffer as any).buffer.size).toBe(0);
  });

  test('calls preprocess() for each added frame', async () => {
    const preprocessSpy = jest.spyOn(buffer as any, 'preprocess');
    const rawData = new Int32Array([1, 2, 3]).buffer;
    const frame = new Frame({
      rawData,
      keepTensor: false,
      shape: [1, 1, 3],
      dtype: 'int32',
      timestamp: [1000],
    });
    await buffer.add(frame);
    expect(preprocessSpy).toHaveBeenCalled();
    preprocessSpy.mockRestore();
  });

  test('isReadyState() returns true when buffer size meets minWindowLengthState', async () => {
    methodConfig.minWindowLengthState = 2;
    buffer = new MockBuffer(roi, methodConfig);
    for (let i = 0; i < 2; i++) {
      // minWindowLengthState is 2
      const rawData = new Int32Array([i, i + 1, i + 2]).buffer;
      const frame = new Frame({
        rawData,
        keepTensor: false,
        shape: [1, 1, 3],
        dtype: 'int32',
        timestamp: [i * 1000],
      });
      await buffer.add(frame);
    }

    expect(buffer.isReadyState()).toBe(true);
  });
});
