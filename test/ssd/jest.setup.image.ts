import * as fs from 'fs';
import * as path from 'path';
import * as tf from '@tensorflow/tfjs-node';
import { Frame } from '../../src/processing/Frame';

/**
 * Loads the sample image file from disk and returns a Frame instance.
 * @returns A Frame instance with the loaded test image.
 */
export function getTestImageFrame(): Frame {
  const filePath = path.resolve(__dirname, '../../examples/sample_image_1.png');
  const buffer = fs.readFileSync(filePath);
  const imageTensor = tf.node.decodeImage(new Uint8Array(buffer), 3);
  const frame = Frame.fromTensor(imageTensor, false, [0]);
  imageTensor.dispose();
  return frame;
}
