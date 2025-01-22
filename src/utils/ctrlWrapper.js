export const ctrlWrapper = (ctrl) => async(req, res, next) => {
    try {
        await ctrl(req, res, next);
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
        });
    }
};
