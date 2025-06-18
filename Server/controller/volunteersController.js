import volunteerService from '../services/volunteerService.js';
const volunteersController = {
  getVolunteerProfile: async (req, res) => {
    console.log("הגיע לכונטרולר");
    try {
      const userId = req.params.id;
      const profile = await volunteerService.getVolunteerProfile(userId);
      return res.json(profile);
    } catch (err) {
      console.error("Error in getProfile:", err);
      res.status(500).json({ error: err.message || 'Failed to get volunteer profile' });
    }
  },

  updateVolunteerProfile: async (req, res) => {
    try {
      const userId = req.params.id;
      const result = await volunteerService.updateVolunteer(userId, req.body);
      res.json(result);
    } catch (err) {
      console.error("Error in updateProfile:", err);
      res.status(500).json({ error: err.message || 'Failed to update volunteer profile' });
    }
  },

  getShifts: async (req, res) => {
    try {
      const { id } = req.params;
      const shifts = await volunteerService.getShifts(id);
      res.json(shifts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getOpenRequests: async (req, res) => {
    try {
      const { id } = req.params;
      const requests = await volunteerService.getOpenRequests(id);
      res.json(requests);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getCertificate: async (req, res) => {
    try {
      const { id } = req.params;
      const certificate = await volunteerService.getCertificate(id);
      res.json(certificate);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateShift: async (req, res) => {
    res.json({ message: 'updateShift - לא מומש עדיין' });
  },

  deleteShift: async (req, res) => {
    res.json({ message: 'deleteShift - לא מומש עדיין' });
  },

  getPermanentShifts: async (req, res) => {
    res.json({ message: 'getPermanentShifts - לא מומש עדיין' });
  },
}
export default volunteersController;

