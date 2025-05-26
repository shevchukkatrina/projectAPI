module.exports = (req, res, next) => {
    const start = process.hrtime();

    res.on('finish', () => {
        const diff = process.hrtime(start);
        const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
        console.log(`Request ${req.method} ${req.originalUrl} takes ${responseTime.toFixed(2)}ms`);
    });

    next();
};
