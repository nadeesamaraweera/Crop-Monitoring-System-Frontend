export class CropModel {
    constructor(cropCode, cropName, cropScientificName, cropCategory, cropSeason, cropImage, fields) {
        this.cropCode = cropCode;
        this.cropName = cropName;
        this.cropScientificName = cropScientificName;
        this.cropCategory = cropCategory;
        this.season = cropSeason;
        this.cropImage = cropImage;
        this.fields = fields || [];
    }

}