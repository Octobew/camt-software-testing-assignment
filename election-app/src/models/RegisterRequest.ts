export interface RegisterRequest {
    nationalId: string;
    firstname: string;
    lastname: string;           
    address: string; 
    province: string;
    district: string;
    subdistrict: string;
    consituencyId: number;
    password: string;
    confirmPassword: string;
}