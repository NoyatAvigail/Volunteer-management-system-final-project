import homeService from '../services/homeService.js';

const homeController = {
    async getStats(req, res) {
        try {
            const stats = await homeService.gethome();
            res.status(200).json(stats);
        } catch (err) {
            console.error("Error fetching home stats:", err);
            res.status(500).json({ error: "Failed to fetch statistics" });
        }
    }
};

export default homeController;