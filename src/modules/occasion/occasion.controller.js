const occasionService = require('./occasion.service');

const getPublic = async (req, res, next) => {
    try {
        const occasions = await occasionService.getPublicOccasions();
        res.json({ success: true, data: occasions });
    } catch (err) {
        next(err);
    }
};

const getAll = async (req, res, next) => {
    try {
        const occasions = await occasionService.getAllOccasions();
        res.json({ success: true, data: occasions });
    } catch (err) {
        next(err);
    }
};

const getById = async (req, res, next) => {
    try {
        const occasion = await occasionService.getOccasionById(req.params.id);
        res.json({ success: true, data: occasion });
    } catch (err) {
        next(err);
    }
};

const create = async (req, res, next) => {
    try {
        const occasion = await occasionService.createOccasion(req.body);
        res.status(201).json({ success: true, data: occasion });
    } catch (err) {
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        const occasion = await occasionService.updateOccasion(req.params.id, req.body);
        res.json({ success: true, data: occasion });
    } catch (err) {
        next(err);
    }
};

const remove = async (req, res, next) => {
    try {
        await occasionService.deleteOccasion(req.params.id);
        res.json({ success: true, message: 'Occasion deleted' });
    } catch (err) {
        next(err);
    }
};

const reorder = async (req, res, next) => {
    try {
        const occasions = await occasionService.reorderOccasions(req.body.orderedIds);
        res.json({ success: true, data: occasions });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getPublic,
    getAll,
    getById,
    create,
    update,
    remove,
    reorder,
};
