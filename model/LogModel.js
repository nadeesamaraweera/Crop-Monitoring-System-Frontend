export class  LogModel {
    constructor(logCode, logDate, logDetails, observedImage, relevantFields, relevantCrops, relevantStaff) {
        this.logCode = logCode;
        this.logDate = logDate;
        this.logDetails = logDetails;
        this.observedImage = observedImage;
        this.relevantFields = relevantFields;
        this.relevantCrops = relevantCrops;
        this.relevantStaff = relevantStaff;
    }

}