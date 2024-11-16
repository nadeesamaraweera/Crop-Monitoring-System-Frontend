export class StaffModel {
    constructor(id, firstName, lastName, designation, gender, joinedDate, dob, addressLine1, addressLine2, addressLine3, addressLine4, addressLine5, contactNo, staffEmail, staffRole, staffFields,staffVehicle) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.designation = designation;
    this.gender = gender;
    this.joinedDate = new Date(joinedDate);
    this.dob = new Date(dob);
    this.addressLine1 = addressLine1;
    this.addressLine2 = addressLine2;
    this.addressLine3 = addressLine3;
    this.addressLine4 = addressLine4;
    this.addressLine5 = addressLine5;
    this.contactNo =contactNo;
    this.staffEmail = staffEmail;
    this.staffRole = staffRole;
    this.staffFields = staffFields;
    this.staffVehicle = staffVehicle;
    }
}
