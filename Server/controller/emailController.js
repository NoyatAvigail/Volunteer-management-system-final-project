import emailsService from '../services/emailsService'
const emailController = {
    sendEditEmail: async (req, res) => {
        try {
            const authenticatedId = req.user.id?.toString();
            const authenticatedEmail = req.user.email?.toString();
            if (!authenticatedId || !authenticatedEmail)
                return res.status(400).send("Missing user ID or email");
            const code = emailsService.generateSimple();
            emailsService.storeEditCode(authenticatedId, code);
            await emailsService.sendEditVerificationMail(authenticatedEmail, code);
            res.send("Email sent");
        } catch (err) {
            console.error("Error sending edit email:", err);
            res.status(500).send("Internal Server Error");
        }
    },
    verifyEditCode: async (req, res) => {
        try {
            const { code } = req.body;
            const authenticatedId = req.user.id?.toString();
            if (!code || !authenticatedId)
                return res.status(400).send("Missing code or user ID");
            const isValid = emailsService.verifyStoredCode(authenticatedId, code);
            if (!isValid) {
                return res.status(400).send("Invalid or expired code");
            }
            res.status(200).send({ message: "Code valid" });
        } catch (err) {
            console.error("Error verifying code:", err);
            res.status(500).send("Internal Server Error");
        }
    }
}
export default emailController;