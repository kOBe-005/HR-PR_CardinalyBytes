import { CompressionMode } from '../types';

export const VITALLENS_FILE_ENDPOINT =
  'https://api.rouast.com/vitallens-v3/file';
export const VITALLENS_STREAM_ENDPOINT =
  'https://api.rouast.com/vitallens-v3/stream';

// Vitals estimation constraints [1/min]
export const CALC_HR_MIN = 40;
export const CALC_HR_MAX = 240;
export const CALC_RR_MIN = 1;
export const CALC_RR_MAX = 60;

// Vitals estimation window sizes [s]
export const AGG_WINDOW_SIZE = 10; // Must be smaller or equal to smallest CALC_WINDOW_SIZE
export const CALC_HR_WINDOW_SIZE = 10;
export const CALC_HR_MIN_WINDOW_SIZE = 2;
export const CALC_RR_WINDOW_SIZE = 30;
export const CALC_RR_MIN_WINDOW_SIZE = 4;

// Face detection defaults [Hz]
export const FDET_DEFAULT_FS_FILE = 0.5;
export const FDET_DEFAULT_FS_STREAM = 1.0;

export const COMPRESSION_MODE: CompressionMode = 'gzip';
