export class CropModel {
    constructor(cropCode, cropName, cropScientificName, cropCategory, cropSeason, cropImage, fields) {
        this.cropCode = cropCode;
        this.cropName = cropName;
        this.scientificName = cropScientificName;
        this.category = cropCategory;
        this.season = cropSeason;
        this.cropImage = cropImage;
        this.fields = fields || [];
    }

}