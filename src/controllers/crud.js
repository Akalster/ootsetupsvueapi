// this contains all basic CRUD endpoints on a schema

const errors = require('../errors');
const bcrypt = require("bcryptjs");

// the schema is supplied by injection
class CrudController {
    constructor(model) {
        this.model = model;
    }

    // we HAVE to use lambda functions here, as they have
    // lexical scope for 'this'
    create = async (req, res, next) => {
        const entity = new this.model(req.body);
        entity.createdBy = req.user.id;
        await entity.save();
        res.status(201).json({ id: entity.id, userid: entity.createdBy });
    };

    getAll = async (req, res, next) => {
        const entities = await this.model.find();
        res.status(200).send(entities);
    };

    getOne = async (req, res, next) => {
        const entity = await this.model.findById(req.params.id);
        res.status(200).send(entity);
    };

    update = async (req, res, next) => {
        if(req.body.password){
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }
        await this.model.findByIdAndUpdate(req.params.id, req.body);
        res.status(204).end();
    };

    delete = async (req, res, next) => {
        // this happens in two steps to make mongoose middleware run
        const entity = await this.model.findById(req.params.id);
        await entity.delete();
        res.status(204).end();
    };
}

module.exports = CrudController;
