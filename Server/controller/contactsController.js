import contactsService from "../services/contactsService.js";
import genericController from '../controller/genericController.js'

const contactController = {
  getThanks: async (req, res) => {
    try {
      const authenticated = await genericController.utils(req);
      const requests = await contactsService.getThanks(authenticated.authenticatedId);
      res.status(200).json(requests);
    } catch (error) {
      console.error("Error in getThanks Controller:", error);
      if (error.status == 403) {
        return res.status(403).json({ message: error.message });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  createThanks: async (req, res) => {
    try {
      const authenticated = await genericController.utils(req);
      const requests = await contactsService.createThanks(authenticated.authenticatedId, req.body);
      res.status(200).json(requests);
    } catch (error) {
      console.error("Error in createThanks Controller:", error);
      if (error.status == 403) {
        return res.status(403).json({ message: error.message });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};

export default contactController;