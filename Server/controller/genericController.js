const genericController = {
    utils: async (req) => {
        const authenticatedId = req.user.id.toString();
        const authenticatedType = req.user.type.toString();
        const authenticatedEmail = req.user.email.toString();
        return { authenticatedId, authenticatedEmail, authenticatedType }
    },
};

export default genericController;