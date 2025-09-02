import {
	NonEmptyTrimmedString1000,
	NonEmptyTrimmedString100,
	id,
	object,
	DateIso,
	Boolean,
	union,
	regex,
	TrimmedString,
	optional
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

export const BarcodeLogoUrl = NonEmptyTrimmedString1000;
export type BarcodeLogoUrl = typeof BarcodeLogoUrl.Type;

export const CreateBarcodeSchema = object({
	title: BarcodeTitle,
	code: BarcodeCode,
	format: BarcodeFormat,
	bgColor: BarcodeBgColor,
	textColor: BarcodeTextColor,
	logoUrl: optional(BarcodeLogoUrl)
});

export const BarcodeSchema = {
	id: BarcodeId,
	title: BarcodeTitle,
	code: BarcodeCode,
	format: BarcodeFormat,
	bgColor: BarcodeBgColor,
	textColor: BarcodeTextColor,
	logoUrl: optional(BarcodeLogoUrl)
};

export const Barcode = object({
	...BarcodeSchema,
	createdAt: DateIso,
	updatedAt: DateIso,
	isDeleted: Boolean
});
export type Barcode = typeof Barcode.Type;
