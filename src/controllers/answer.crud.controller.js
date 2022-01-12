// this contains all basic CRUD endpoints on a schema

const errors = require('../errors');

// the schema is supplied by injection
class AnswerCrudController {
    constructor(model) {
        this.model = model;
    }

    // we HAVE to use lambda functions here, as they have
    // lexical scope for 'this'
    create = async (req, res, next) => {
        const questionId = req.params.questionId;
        const answerProps = req.body;
        answerProps.questionId = questionId;
        answerProps.createdBy = req.user.id;

        const entity = new this.model(answerProps);
        await entity.save();
        res.status(201).send(entity);
    };

    update = async (req, res, next) => {
        const entity = await this.model.findById(req.params.answerId);

        if (entity.createdBy.valueOf() == req.user.id) {
            await this.model.findByIdAndUpdate(req.params.answerId, req.body);
            res.status(204).end();
        }else{
            res.status(401).send({message: "Not authorized!"})
        }      

    };

    delete = async (req, res, next) => {
        const entity = await this.model.findById(req.params.answerId);
        // this happens in two steps to make mongoose middleware run
        if (entity.createdBy.valueOf() == req.user.id) {
            await entity.delete();
            res.status(204).end();
        }else{
            res.status(401).send({message: "Not authorized!"})
        }

    };

    getAnswerByQuestionId = async (req, res, next) => {
        const questionId = req.params.questionId; 
        const entity = await this.model.find({questionId: questionId})
        res.status(201).send(entity);
    }; 
}

module.exports = AnswerCrudController;
