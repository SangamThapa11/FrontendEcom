export enum UserRoles {
    ADMIN= "admin",
    SELLER="seller",
    CUSTOMER="customer"
}

export enum Gender {
    MALE= "male",
    FEMALE="female",
    OTHER="other"
}

export enum Status {
    ACTIVE= "active",
    INACTIVE="inactive",
}

export enum isFeatured {
    TRUE="true",
    FALSE="false",
}

export enum inMenu {
    TRUE="true",
    FALSE="false",
}

export enum InputType {
    TEXT= "text",
    EMAIL = "email",
    URL = "url",
    NUMBER = "number"
}

export interface IImageType {
    publicId: string,
    imageUrl: string,
    thumbUrl: string ,
}
export interface IPaginationParams{
    page?: number | null,
    limit?: number | null,
    search?: string | null,
    isPaid?: boolean,
    startDate?: string | Date | null; // Accept both string and Date
    endDate?: string | Date | null; 
}
