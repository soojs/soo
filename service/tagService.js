const db = require('./../db');
const Tag = db.model.Tag;
const util = require('./../util');

const _ = util._;
const co = util.co;

module.exports.addTag = ($tag) => {
    return Tag.create($tag);
};

module.exports.getTagList = () => {

    // tag不会过多，直接查询全部
    return Tag.findAndCountAll({
        where: {
            is_delete: '1'
        },
        order: 'createdAt DESC'
    });
};

module.exports.getTagById = id => {
    return co(function *() {
        return yield Tag.findById(id);
    });
};

module.exports.getTagByName = (name) => {
    return co(function *() {
        return yield Tag.findAll({
            where: {
                name: name,
                is_delete: '1'
            }
        });
    });
};

module.exports.deleteTag = (id) => {
    return co(function *() {
        let tag = yield Tag.findById(id);

        if (tag) {
            return yield tag.update({is_delete: '2'});
        }

        return null;
    });
};

