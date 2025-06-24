import volunteerService from '../services/volunteersService.js';
import genericController from '../controller/genericController.js'

const volunteersController = {
  getShifts: async (req, res) => {
    try {
      const authenticated = await genericController.utils(req);
      const shifts = await volunteerService.getShifts(authenticated.authenticatedId, authenticated.authenticatedType);
      return res.json(shifts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getCertificate: async (req, res) => {
    const authenticated = await genericController.utils(req);
    try {
      const certificate = await volunteerService.getCertificate(authenticated.authenticatedId);
      res.json(certificate);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
}

export default volunteersController;

