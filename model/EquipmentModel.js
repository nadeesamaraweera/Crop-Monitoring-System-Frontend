export class EquipmentModel {
    constructor(id, name, type, status, assignedStaff, assignedField) {
        this.equipmentCode = id;
        this.equipmentName = name;
        this.equipmentType = type;
        this.equipmentStatus = status;
        this.equipmentAssignedStaff = assignedStaff;
        this.equipmentAssignedField = assignedField;

    }
}
