import { Column, Entity } from "typeorm";
import { isDate } from "util/types";

import { formatDate } from "@libs/common/utils";

// TODO: Solicitar que acrescentem uma PK para esta entity no BD
@Entity("TBL_SISTEMA_HISTORICO")
export class AuditoriaEntity {

    constructor(entrada?: AuditoriaEntity) {
        if (entrada) {
          Object.keys(entrada).forEach((property) => {
            if (isDate(this[property])) {
              this[property] = formatDate(this[property])
            } else {
              this[property] = entrada[property]
            }
          })
        }
    }

    @Column("clob", { name: "TXT_SQL", nullable: true })
    txtSql: string | null;

    @Column("varchar", {
        name: "TXT_ENDERECO_NOME",
        nullable: true,
        length: 255,
    })
    txtEnderecoNome: string | null;

    @Column("varchar", { name: "TXT_ENDERECO_IP", nullable: true, length: 28 })
    txtEnderecoIp: string | null;

    @Column("varchar", { name: "TXT_ALTERACAO", nullable: true, length: 4000 })
    txtAlteracao: string | null;

    @Column("timestamp", { name: "DT_ACAO", default: () => "sysdate" })
    dtAcao: Date;

    @Column("text", { name: "usuarioId" })
    usuarioId: string;

    @Column("number", { name: "COD_ORIGEM", nullable: true, scale: 0 })
    codOrigem: number | null;

    @Column("number", {
        name: "COD_ORGAO",
        precision: 10,
        scale: 0,
        default: () => "0",
    })
    codOrgao: number;

    // TODO: remover config de PK desta propriedade
    @Column("number", { primary: true, name: "COD_CHAVE", scale: 0 })
    codChave: number;

    @Column("number", { name: "COD_ACAO", scale: 0 })
    codAcao: number;

}
