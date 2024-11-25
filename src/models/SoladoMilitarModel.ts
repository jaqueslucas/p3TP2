class SoldadoMilitarModel {
    id: string = "";
    soldadoId: string;
    militarId: string;

    constructor(soldadoId: string, militarId: string) {
        this.soldadoId = soldadoId;
        this.militarId = militarId;
    }
}

export default SoldadoMilitarModel;
