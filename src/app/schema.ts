import { type EvoluSchema } from '@evolu/common';
import { BarcodeSchema } from './barcode.model';

const DatabaseSchema = {
	barcode: BarcodeSchema
} satisfies EvoluSchema;

export default DatabaseSchema;

export type DatabaseSchema = typeof DatabaseSchema;
