import type {
	BarcodeId,
	BarcodeTitle,
	BarcodeCode,
	BarcodeFormat,
	BarcodeBgColor,
	BarcodeTextColor,
	BarcodeLogoUrl
} from './barcode.model';
import { evolu } from './evolu';
import type { kysely } from '@evolu/common';

export const queryBarcodes = evolu.createQuery(
	(db) =>
		db
			.selectFrom('barcode')
			.select([
				'id',
				'title',
				'code',
				'format',
				'bgColor',
				'textColor',
				'logoUrl',
				'createdAt',
				'updatedAt',
				'isDeleted'
			])
			.where('isDeleted', 'is not', 1)
			// Filter null value and ensure non-null type.
			.where('title', 'is not', null)
			.$narrowType<{ title: kysely.NotNull }>()
			.orderBy('createdAt', 'desc'),
	{
		// logQueryExecutionTime: true,
		// logExplainQueryPlan: true,
	}
);

export const queryBarcodeById = (barcodeId: BarcodeId) =>
	evolu.createQuery((db) =>
		db
			.selectFrom('barcode')
			.select([
				'id',
				'title',
				'code',
				'format',
				'bgColor',
				'textColor',
				'logoUrl',
				'createdAt',
				'updatedAt',
				'isDeleted'
			])
			.where('id', '=', barcodeId)
			.where('isDeleted', 'is not', 1)
			.limit(1)
	);

export const createBarcode = (
	title: BarcodeTitle,
	code: BarcodeCode,
	format: BarcodeFormat,
	bgColor: BarcodeBgColor,
	textColor: BarcodeTextColor,
	logoUrl: BarcodeLogoUrl
) =>
	insert('barcode', {
		title,
		code,
		format,
		bgColor,
		textColor,
		logoUrl
	});

export const updateBarcode = (
	id: BarcodeId,
	title: BarcodeTitle,
	code: BarcodeCode,
	format: BarcodeFormat,
	bgColor: BarcodeBgColor,
	textColor: BarcodeTextColor,
	logoUrl: BarcodeLogoUrl
) => update('barcode', { id, title, code, format, bgColor, textColor, logoUrl });

export const deleteBarcode = (id: BarcodeId) => update('barcode', { id, isDeleted: true });

export const updateBarcodeFormat = (id: BarcodeId, format: BarcodeFormat) =>
	update('barcode', { id, format });

const { insert, update } = evolu;
