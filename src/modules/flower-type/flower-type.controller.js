const flowerTypeService = require('./flower-type.service');

const getPublic = async (req, res, next) => {
    try {
        const types = await flowerTypeService.getPublicTypes();
        res.json({ success: true, data: types });
    } catch (err) {
        next(err);
    }
};

const getAll = async (req, res, next) => {
    try {
        const types = await flowerTypeService.getAllTypes();
        res.json({ success: true, data: types });
    } catch (err) {
        next(err);
    }
};

const getById = async (req, res, next) => {
    try {
        const type = await flowerTypeService.getTypeById(req.params.id);
        res.json({ success: true, data: type });
    } catch (err) {
        next(err);
    }
};

const create = async (req, res, next) => {
    try {
        const type = await flowerTypeService.createType(req.body);
        res.status(201).json({ success: true, data: type });
    } catch (err) {
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        const type = await flowerTypeService.updateType(req.params.id, req.body);
        res.json({ success: true, data: type });
    } catch (err) {
        next(err);
    }
};

const remove = async (req, res, next) => {
    try {
        await flowerTypeService.deleteType(req.params.id);
        res.json({ success: true, message: 'Flower type deleted' });
    } catch (err) {
        next(err);
    }
};

const reorder = async (req, res, next) => {
    try {
        const types = await flowerTypeService.reorderTypes(req.body.orderedIds);
        res.json({ success: true, data: types });
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
