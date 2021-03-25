var path = require('path');
// const { console } = require('console');
const Pagamento = require('../models/pagamentos');
const caixa = require('../models/caixa');
const { getById } = require('./MedidaController');
const Caixa = require('../models/caixa');
const Cliente = require('../models/cliente');

module.exports = {
    async view(req, res) {
        await Pagamento.find(err, pagamento => {
            console.log(pagamento);
        });


    },
    async addPag(req, res) {
        let id = req.body.id;
        if (id == '') {
            let pag = await Pagamento.create(req.body);
            return res.json(pag);
        } else {
            pag = await Pagamento.updateOne({ _id: id }, { tipo: req.body.tipo, cliente: req.body.cliente, valor: req.body.valor, gorjeta: req.body.gorjeta, funcionario: req.body.funcionario });
            return res.json(pag);

        }


    },
    async getById(req, res) {
        let pagamento = await Pagamento.findById({ _id: req.params.id });
        return res.json(pagamento);
    },

    async getAllView(req, res) {
        const hora = "T00:00:00.000+00:00";
        const hora2 = "T23:59:59.058+00:00";
        let gorjeta = 0;

        if (req.body.busca == '') {
            var inicio = req.body.inicio + hora;
            var fim = req.body.fim + hora2;

            await Pagamento.find({
                createdAt: {
                    '$gte': inicio,
                    '$lt': fim
                }
            }, (err, pagamentos) => {
                // console.log(pagamentos);

                return res.json(pagamentos);


            }).populate('cliente').populate({
                path: 'caixa',
                // match: {
                //     status: { $lt: 2 }
                // }
            });
            // console.log(pagamentos);
        } else {
            await Pagamento.find({}, (err, pagamentos) => {
                return res.json(pagamentos);
            }).populate('cliente');
        }


    },
    async removeById(req, res) {
        await Pagamento.findById(req.params.id, async(err, pagamento) => {
            if (err) { return res.status(500).json({ error: "ID INVALID" }); }
            if (pagamento) {
                await Pagamento.deleteOne(pagamento, (err) => {
                    if (err) { return res.status(500).json({ error: "Error in process!" }); }
                    return res.json({ msg: "Removido com sucesso!" });
                });
            } else {
                return res.status(500).json({ error: "Not Found!" });
            }
        });
    },
    async verificaById(req,res) {
        var dado = req.params.id;
        var credito=0;
        await Pagamento.find({"cliente":dado,"tipo":"Carteira"},async(err, creditos)=>{
            creditos.forEach(element=>{
                credito+=parseFloat(element.valor);
            });
            return res.json(parseFloat(credito).toFixed(2));
        });
        

    },

    async getAllCaderno(req, res) {
        
        const hora = "T00:00:00.000+00:00";
        const hora2 = "T23:59:59.058+00:00";
        let gorjeta = 0;

        if (req.body.busca == '') {
            var inicio = req.body.inicio + hora;
            var fim = req.body.fim + hora2;

            await Pagamento.find({
                createdAt: {
                    '$gte': inicio,
                    '$lt': fim
                },tipo:"Carteira"
            }, (err, pagamentos) => {
                // console.log(pagamentos);

                return res.json(pagamentos);


            }).populate('cliente').populate({
                path: 'caixa',
                // match: {
                //     status: { $lt: 2 }
                // }
            });
            // console.log(pagamentos);
        } else {
            var cliente= await Cliente.find({'name': { $regex: req.body.busca, $options: 'i' }});
            // console.log(cliente[0]['name']);
            await Pagamento.find({ 'cliente': cliente[0]['_id'],tipo:"Carteira"}, (err, pagamentos) => {
                return res.json(pagamentos);
            }).populate('cliente').populate({
                path: 'caixa',
                // match: {
                //     status: { $lt: 2 }
                // }
            });
        }


    },
    async receberPag(req,res){
        var h = "T00:00:00.000+00:00";
        pag = await Pagamento.updateOne({ _id: req.body.id }, { tipo: req.body.tipo, createdAt:req.body.data+h});
        return res.json(pag);
    }

}