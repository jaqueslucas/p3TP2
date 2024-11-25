class SoldadoModel {
    id: string = "";
    cim: string;
    altura: number;
    militarId: string;

    constructor(cim: string, altura: number, militarId: string) {
        this.cim = cim;
        this.altura = altura;
        this.militarId = militarId;
    }
}

export default SoldadoModel;
