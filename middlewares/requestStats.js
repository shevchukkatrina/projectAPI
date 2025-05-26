module.exports = (req, res, next) => {
    console.log({
        pathVariables: req.params,
        queryString: req.query,
    });
    next();
};
