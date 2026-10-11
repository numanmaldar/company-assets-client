// company-assets-client/src/api/assets.ts
import { api } from "./client";

export interface Employee {
    id: string;
    employee_id: string;
    name: string;
    email: string;
    department: string;
    status: string;
}

export interface Device {
    id: string;
    type: string;
    brand: string;
    model: string;
    serial_number: string;
    status: string;
}

export interface Assignment {
    id: string;
    assigned_at: string;
    returned_at: string | null;
    notes: string | null;
    employees: Pick<Employee, "id" | "employee_id" | "name" | "department">;
    devices: Pick<Device, "id" | "type" | "brand" | "model" | "serial_number">;
}

// Employees
export const getEmployees = async () => {
    const response = await api.get<Employee[]>("/employees");
    return response.data;
};

export const createEmployee = async (data: Omit<Employee, "id" | "status">) => {
    const response = await api.post<Employee>("/employees", data);
    return response.data;
};

export const deleteEmployee = async (id: string) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
};

// Devices
export const getDevices = async () => {
    const response = await api.get<Device[]>("/devices");
    return response.data;
};

export const createDevice = async (data: Omit<Device, "id" | "status">) => {
    const response = await api.post<Device>("/devices", data);
    return response.data;
};

export const deleteDevice = async (id: string) => {
    const response = await api.delete(`/devices/${id}`);
    return response.data;
};

// Assignments
export const getAssignments = async () => {
    const response = await api.get<Assignment[]>("/assignments");
    return response.data;
};

export const createAssignment = async (data: {
    employee_id: string;
    device_id: string;
    notes?: string;
}) => {
    const response = await api.post<Assignment>("/assignments", data);
    return response.data;
};

export const returnDevice = async (assignmentId: string) => {
    const response = await api.patch(`/assignments/${assignmentId}/return`);
    return response.data;
};