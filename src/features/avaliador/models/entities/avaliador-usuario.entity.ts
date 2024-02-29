import { Entity, OneToOne } from "typeorm";

import { IdEntityAbstractClass } from "@sd-root/libs/common/src/models/entities/id-entity-class.entity";
import { UsuarioEntity } from "@sd-root/src/features/usuario/models/entities/usuario.entity";
import { JoinColumn } from "typeorm";
import { AvaliadorEntity } from "./avaliador.entity";

@Entity("TBL_AVALIADOR_USUARIO")
export class AvaliadorUsuarioEntity extends IdEntityAbstractClass {

    @OneToOne(type => AvaliadorEntity)
    @JoinColumn({referencedColumnName: 'id', foreignKeyConstraintName: 'fk_avaliador_usuario_avaliador_id'})
    _avaliador: AvaliadorEntity;
    
    @OneToOne(type => UsuarioEntity)
    @JoinColumn({referencedColumnName: 'id', foreignKeyConstraintName: 'fk_avaliador_usuario_usuario_id'})
    _usuario: UsuarioEntity;

}
// @Entity("REL_SISTEMA_METODO")
// export class SistemaMetodoEntity {

//     // @Column("uuid", { primary: true, generated: 'uuid' })
//     // id: string;

//     @Column("uuid", { primary: true })
//     sistemaId: string;

//     @Column("uuid", { primary: true })
//     metodoId: string;

//     @ManyToOne(type => SistemaEntity, e => e._sistemaMetodoList)
//     @JoinColumn([{ name: 'sistema_id', referencedColumnName: 'id' }])
//     _sistema: SistemaEntity[];
    
//     @ManyToOne(type => MetodoEntity, e => e._sistemaMetodoList)
//     @JoinColumn([{ name: 'metodo_id', referencedColumnName: 'id' }])
//     _metodo: MetodoEntity[];

// }