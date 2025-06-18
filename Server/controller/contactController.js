// import * as contactService from '../services/contactService.js';
const contactController={
getHome : async (req, res) => {
  try {
    const { id } = req.params;
    const data = await contactService.getHomeData(id);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
},

getMyRequests : async (req, res) => {
  try {
    const { id } = req.params;
    const requests = await contactService.getRequestsByContact(id);
    res.json(requests);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
},

createRequest : async (req, res) => {
  try {
    const { id } = req.params;
    const newRequest = await contactService.createRequest(id, req.body);
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(err.status || 400).json({ message: err.message });
  }
},

getProfile: async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await contactService.getContactProfile(id);
    res.json(profile);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
},

updateProfile :async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await contactService.updateContactProfile(id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(err.status || 400).json({ message: err.message });
  }
},

getThanks : async (req, res) => {
  try {
    const { id } = req.params;
    const thanks = await contactService.getThanksEntries(id);
    res.json(thanks);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
},

addPatient : async (req, res) => {
  try {
    const { contactPersonId } = req.params;
    const patient = await contactService.addPatient(contactPersonId, req.body);
    res.status(201).json(patient);
  } catch (err) {
    res.status(err.status || 400).json({ message: err.message });
  }
},

getAllPatients :async (req, res) => {
  try {
    const { contactPersonId } = req.params;
    const patients = await contactService.getPatientsByContact(contactPersonId);
    res.json(patients);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
},

getPatientByUserId : async (req, res) => {
  try {
    const { contactPersonId, patientUserId } = req.params;
    const patient = await contactService.getPatient(contactPersonId, patientUserId);
    res.json(patient);
  } catch (err) {
    res.status(err.status || 404).json({ message: err.message });
  }
},

updatePatientProfile : async (req, res) => {
  try {
    const { contactPersonId, patientUserId } = req.params;
    const updated = await contactService.updatePatient(contactPersonId, patientUserId, req.body);
    res.json(updated);
  } catch (err) {
    res.status(err.status || 400).json({ message: err.message });
  }
},

deletePatient :async (req, res) => {
  try {
    const { contactPersonId, patientUserId } = req.params;
    await contactService.deletePatient(contactPersonId, patientUserId);
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
},
}
export default contactController;

