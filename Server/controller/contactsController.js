import contactsService from "../services/contactsService.js";

const contactController = {
  utils: (req) => {
    const authenticatedId = req.user.id?.toString();
    const authenticatedType = req.user.type?.toString();
    return { authenticatedId, authenticatedType };
  },

  getPatients: async (req, res) => {
    try {
      const authenticated = contactController.utils(req);
      console.log("authenticated:", authenticated);

      const requests = await contactsService.getPatients(authenticated.authenticatedId);
      res.status(200).json(requests);
    } catch (error) {
      console.error("Error in getPatients Controller:", error);
      if (error.status == 403) {
        return res.status(403).json({ message: error.message });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  createPatient: async (req, res) => {
    try {
      const authenticated = contactController.utils(req);
      const requests = await contactsService.createPatient(authenticated.authenticatedId, req.body);
      console.log("requests:", requests);

      res.status(200).json(requests);
    } catch (error) {
      console.error("Error in createPatient Controller:", error);
      if (error.status == 403) {
        return res.status(403).json({ message: error.message });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  getPatientById: async (req, res) => {
    try {
      const authenticated = contactController.utils(req);
      const patientId = req.params.patientId;
      const requests = await contactsService.getPatientById(authenticated.authenticatedId, patientId);
      res.status(200).json(requests);
    } catch (error) {
      console.error("Error in getPatientById Controller:", error);
      if (error.status == 403) {
        return res.status(403).json({ message: error.message });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  updatePatient: async (req, res) => {
    try {
      const authenticated = utils(req);
      const patientId = req.params.patientId;
      const requests = await contactsService.updatePatient(authenticated.authenticatedId, patientId, req.body);
      res.status(200).json(requests);
    } catch (error) {
      console.error("Error in updatePatient Controller:", error);
      if (error.status == 403) {
        return res.status(403).json({ message: error.message });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  deletePatient: async (req, res) => {
    try {
      const authenticated = utils(req);
      const patientId = req.params.patientId;
      const requests = await contactsService.deletePatient(authenticated.authenticatedId, patientId);
      res.status(200).json(requests);
    } catch (error) {
      console.error("Error in deletePatient Controller:", error);
      if (error.status == 403) {
        return res.status(403).json({ message: error.message });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  getHospitalizeds: async (req, res) => {
    try {
      const authenticated = utils(req);
      const requests = await contactsService.getHospitalizeds(authenticated.authenticatedId);
      res.status(200).json(requests);
    } catch (error) {
      console.error("Error in getHospitalizeds Controller:", error);
      if (error.status == 403) {
        return res.status(403).json({ message: error.message });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  createHospitalizeds: async (req, res) => {
    try {
      const authenticatedId = req.authenticatedId;
      const { patientId, ...restBody } = req.body;

      const newHospitalized = await contactsService.createHospitalizeds(authenticatedId, patientId, restBody);
      res.status(201).json(newHospitalized);

    } catch (error) {
      console.error("Error in createHospitalizeds Controller:", error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  getThanks: async (req, res) => {
    try {
      const authenticated = utils(req);
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
      const authenticated = utils(req);
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