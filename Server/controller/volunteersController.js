import volunteerService from '../services/volunteersService.js';
const volunteersController = {

  utils: async (req) => {
    const authenticatedId = req.user.id.toString();
    const authenticatedType = req.user.type.toString();
    return { authenticatedId, authenticatedType }
  },

  getShifts: async (req, res) => {
    try {
      console.log("כונטרולר");
      
      const authenticated =await volunteersController.utils(req);
      const shifts = await volunteerService.getShifts(authenticated.authenticatedId, authenticated.authenticatedType);
      return res.json(shifts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getCertificate: async (req, res) => {
    const authenticated = utils(req); try {
      const certificate = await volunteerService.getCertificate(authenticated.authenticatedId);
      res.json(certificate);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
}
export default volunteersController;

