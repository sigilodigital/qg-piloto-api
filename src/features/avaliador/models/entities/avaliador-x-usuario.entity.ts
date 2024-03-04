import { Entity, OneToOne } from "typeorm";

import { EntityAbstractClass } from "@sd-root/libs/common/src/models/classes/entity-abstract.class";
import { UsuarioEntity } from "@sd-root/src/features/usuario/models/entities/usuario.entity";
import { JoinColumn } from "typeorm";
import { AvaliadorEntity } from "./avaliador.entity";

@Entity("TBL_AVALIADOR_X_USUARIO")
export class Avaliador_UsuarioEntity extends EntityAbstractClass {

    @OneToOne(type => AvaliadorEntity)
    @JoinColumn({referencedColumnName: 'id', foreignKeyConstraintName: 'fk_avaliador_x_usuario_avaliador_id'})
    _avaliador: AvaliadorEntity;
    
    @OneToOne(type => UsuarioEntity)
    @JoinColumn({referencedColumnName: 'id', foreignKeyConstraintName: 'fk_avaliador_x_usuario_usuario_id'})
    _usuario: UsuarioEntity;

}