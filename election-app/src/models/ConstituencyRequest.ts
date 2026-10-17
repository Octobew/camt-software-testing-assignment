export interface ConstituencyRequest {
    consituencynumber: number;
    districtCode: string;
    subdistrictCode?: string;
    subdistrictCodes?: string[];
    provinceCode: string;
    zipcode: string;

}