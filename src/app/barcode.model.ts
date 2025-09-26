import {
	NonEmptyTrimmedString1000,
	NonEmptyTrimmedString100,
	id,
	object,
	Boolean,
	union,
	regex,
	TrimmedString,
	nullOr,
	DateIsoString
} from '@evolu/common';

export const BarcodeId = id('BarcodeId');
export type BarcodeId = typeof BarcodeId.Type;

export const BarcodeCode = NonEmptyTrimmedString100;
export type BarcodeCode = typeof BarcodeCode.Type;

export const BarcodeFormat = union(
	'aztec',
	'code_128',
	'code_39',
	'code_93',
	'codabar',
	'data_matrix',
	'ean_13',
	'ean_8',
	'itf',
	'pdf_417',
	'qr_code',
	'upc_a',
	'upc_e',
	'unknown'
);
export type BarcodeFormat = typeof BarcodeFormat.Type;

export const BarcodeTitle = NonEmptyTrimmedString100;
export type BarcodeTitle = typeof BarcodeTitle.Type;

export const BarcodeBgColor = regex('BarcodeBgColor', /^#[0-9A-Fa-f]{6}$/)(TrimmedString);
export type BarcodeBgColor = typeof BarcodeBgColor.Type;

export const BarcodeTextColor = regex('BarcodeTextColor', /^#[0-9A-Fa-f]{6}$/)(TrimmedString);
export type BarcodeTextColor = typeof BarcodeTextColor.Type;

export const BarcodeLogoUrl = nullOr(NonEmptyTrimmedString1000);
export type BarcodeLogoUrl = typeof BarcodeLogoUrl.Type;

export const CreateBarcodeSchema = object({
	title: BarcodeTitle,
	code: BarcodeCode,
	format: BarcodeFormat,
	bgColor: BarcodeBgColor,
	textColor: BarcodeTextColor,
	logoUrl: BarcodeLogoUrl
});

export const BarcodeSchema = {
	id: BarcodeId,
	title: BarcodeTitle,
	code: BarcodeCode,
	format: BarcodeFormat,
	bgColor: BarcodeBgColor,
	textColor: BarcodeTextColor,
	logoUrl: BarcodeLogoUrl
};

export const UpdateBarcodeSchema = object(BarcodeSchema);

export const Barcode = object({
	...BarcodeSchema,
	createdAt: DateIsoString,
	updatedAt: DateIsoString,
	isDeleted: nullOr(Boolean)
});
export type Barcode = typeof Barcode.Type;

export const BarcodeFormatMap: Record<BarcodeFormat, string> = {
	aztec: 'aztec',
	code_128: 'code128',
	code_39: 'code39',
	code_93: 'code93',
	codabar: 'codabar',
	data_matrix: 'datamatrix',
	ean_13: 'ean13',
	ean_8: 'ean8',
	itf: 'itf',
	pdf_417: 'pdf417',
	qr_code: 'qrcode',
	upc_a: 'upca',
	upc_e: 'upce',
	unknown: 'code128'
};
