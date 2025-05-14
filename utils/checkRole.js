export default (roles) => {
    return (req, res, next) => {
        try {
            if (!req.user || !roles.includes(req.user.role)) {
                return res.status(403).json({
                    message: 'У вас немає прав для виконання цієї дії',
                });
            }
            next();
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Помилка перевірки прав доступу',
            });
        }
    };
}