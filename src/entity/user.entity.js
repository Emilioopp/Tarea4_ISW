import { EntitySchema } from "typeorm";

export const UserSchema= new EntitySchema({
    name:'User',
    tableName:"users",
    columns:{
        id:{
            type:'int',
            primary:true,
            generated:true
        },
        rut:{
            type:'varchar',
            length:12,
            unique:true
        },
        nombreCompleto:{
            type:'varchar',
            length:255,
            nullable:false
        },
        correo:{
            type:'varchar',
            length:255,
            nullable:false
        },
        telefono:{
            type:'varchar',
            nullable:false
        },
        createdAt:{
            type:'time with time zone',
            default: ()=> 'CURRENT_TIMESTAMP',
            nullable:false
        },
        updatedAt:{
            type:'time with time zone',
            default: ()=> 'CURRENT_TIMESTAMP',
            nullable:false,
            onUpdate:'CURRENT_TIMESTAMP'
        }
    }
})