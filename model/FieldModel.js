export class FieldModel {
    constructor(fieldCode, fieldName, fieldLocation, extentSize, crops, staff, fieldImage1, fieldImage2) {
        this.fieldCode = fieldCode;
        this.fieldName = fieldName;
        this.fieldLocation = fieldLocation;
        this.extentSize = extentSize;
        this.crops = crops || [];
        this.staff = staff || [];
        this.fieldImage1 = fieldImage1;
        this.fieldImage2 = fieldImage2;
    }

}
