export type RegistrationStatus = "draft" | "submitted" | "accepted" | "rejected" | "withdrawn";
export type Registration = { id:string; public_reference:string; organisation_id:string; event_id:string; pujo_name:string; address:string|null; phone:string|null; theme:string|null; artist_name:string|null; applicant_name:string; email:string; whatsapp_number:string|null; status:RegistrationStatus; created_at:string; updated_at:string };
export type Banner = {id:string;organisation_id:string;event_id:string|null;name:string;quantity:number;status:string};
export type Allocation = {id:string;organisation_id:string;banner_id:string;pujo_registration_id:string|null;allocated_quantity:number;status:string;created_at:string};
export type Distribution = {id:string;organisation_id:string;allocation_id:string;quantity:number;distributed_at:string;recipient_name:string|null;recipient_phone:string|null};
