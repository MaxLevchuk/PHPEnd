import {IUploadedFile} from "../../../interfaces/forms";

export interface IRegister{
    name:string,
    surname:string,
    email:string,
    phone:string,
    password:string,
    password_confirmation:string,
    image:string|undefined
}
export interface IRegisterForm{
    name:string,
    surname:string,
    email:string,
    phone:string,
    password:string,
    password_confirmation:string,
    image:IUploadedFile|null
}