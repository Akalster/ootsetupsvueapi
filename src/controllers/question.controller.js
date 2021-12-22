const Question = require('../models/question.model')() // note we need to call the model caching function
const errors = require('../errors')


async function create(req, res) {
    const reviewId = req.params.reviewId;
    const questionProps = req.body;
    questionProps.reviewkey = reviewId;
    questionProps.createdBy = req.user.id;
    
    const question = new Question(questionProps); 
    await question.save(); 
    res.status(201).json(question);
}

async function update(req, res) {
    const reviewId = req.params.reviewId;
    const questionId = req.params.questionId;
    const questionProps = req.body;
    const entity = await Question.findById(questionId);

    if (entity.createdBy.valueOf() == req.user.id) {
        await Question.findByIdAndUpdate(questionId, questionProps)
        res.status(204).end();
    }else{
        res.status(401).send({message: "Not authorized!"})
    }
    
    
}

async function remove(req, res) {
    const reviewId = req.params.reviewId;
    const questionId = req.params.questionId;
    const entity = await Question.findById(questionId);

    if (entity.createdBy.valueOf() == req.user.id) {
        await Question.findByIdAndDelete(questionId); 
        res.status(204).end();
    }else{
        res.status(401).send({message: "Not authorized!"})
    }
}

module.exports = {
    create,
    update, 
    remove
}
