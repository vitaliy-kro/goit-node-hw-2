const {NotFound, BadRequest} = require('../helpers/errors');
const {
    addContactSchema,
    updadeContactSchema,
    updateFavoriteSchema,
} = require('../schemas/contacts/contactsJoiSchemas');
const {Contact} = require('../schemas/contacts/contactsMongooseSchemas');

const getContacts = async (req, res, next) => {
    const {limit = 20, page = 1, favorite = null} = req.query;
    const {id} = req.user;
    const skip = (page - 1) * limit;
    try {
        if (favorite === 'true' || favorite === 'false') {
            const contacts = await Contact.find(
                {
                    owner: id,
                    favorite,
                },
                {owner: 0}
            )
                .skip(skip)
                .limit(limit);

            return res.json({contacts});
        }
        const contacts = await Contact.find(
            {
                owner: id,
            },
            {owner: 0},
        )
            .skip(skip)
            .limit(limit);
        res.json({contacts});
    } catch (error) {
        next(error);
    }
};

const getContactById = async (req, res, next) => {
    const {contactId} = req.params;
    try {
        const contact = await Contact.findOne(
            {_id: contactId, owner: req.user.id},
            {owner: 0}
        );
        if (!contact) {
            throw new NotFound(`Contact with id:'${contactId}' not found`);
        }

        res.json(contact);
    } catch (error) {
        if (error.name === 'CastError') {
            next(
                new BadRequest(`You write wrong id. Check contact id and try again`)
            );
        }
        next(error);
    }
};

const addContact = async (req, res, next) => {
    const {error} = addContactSchema.validate(req.body);

    if (error?.message) {
        return res.status(400).json({message: error.message});
    }
    try {
        const {_id, name, email, phone, favorite} = await Contact.create({
            ...req.body,
            owner: req.user.id,
        });
        res.status(201).json({ _id, name, email, phone, favorite});
    } catch (error) {
        next(error);
    }
};

const deleteContact = async (req, res, next) => {
    const {contactId} = req.params;

    try {
        const remove = await Contact.findByIdAndRemove(contactId);
        console.log(remove);

        if (!remove) {
            throw new NotFound(`Contact with id ${contactId} not found`);
        }
        res.json({_id: remove._id});
    } catch (error) {
        if (error.name === 'CastError') {
            next(
                new BadRequest(`You write wrong id. Check contact id and try again`)
            );
        }
        next(error);
    }
};

const updateContact = async (req, res, next) => {
    const {body, params, user} = req;

    const {error} = updadeContactSchema.validate(body);

    if (error?.message) {
        return res.status(400).json({message: error.message});
    }
    try {
        const result = await Contact.findOneAndUpdate(
            {_id: params.contactId, owner: user.id},
            {$set: body},
            {new: true}
        );

        if (!result) {
            throw new NotFound(`Contact with id:'${params.contactId}' not found`);
        }
        const {_id, name, email, phone, favorite} = result;
        res.json({id: _id, name, email, phone, favorite});
    } catch (error) {
        if (error.name === 'CastError') {
            next(
                new BadRequest(`You write wrong id. Check contact id and try again`)
            );
        }

        next(error);
    }
};

const updateFavorite = async (req, res, next) => {
    const {body, params, user} = req;
    const {error} = updateFavoriteSchema.validate(body);
    if (error?.message) {
        return res.status(400).json({message: error.message});
    }
    try {
        const result = await Contact.findOneAndUpdate(
            {_id: params.contactId, owner: user.id},
            {$set: body},
            {new: true}
        );
        if (!result) {
            throw new NotFound(`Contact with id:'${params.contactId}' not found`);
        }
        const {_id, name, email, phone, favorite} = result;
        res.status(200).json({id: _id, name, email, phone, favorite});
    } catch (error) {
        if (error.name === 'CastError') {
            next(
                new BadRequest(`You write wrong id. Check contact id and try again`)
            );
        }
        next(error);
    }
};

module.exports = {
    getContacts,
    getContactById,
    addContact,
    deleteContact,
    updateContact,
    updateFavorite,
};
