// EmailService

const companyService = require("../../services/company.service");
const emailService = require("../../services/email.service");
const { successResponder, errorResponder } = require("../../utils/http_responder");

class ContactUsController {
    constructor() {
        this.service = emailService
        this.companyService = companyService
    }

    sendMessage = async (req, res) => {
        //find vendor
        const company = await this.companyService.findOne({ subdomain: req.body.domain }, {
            populate: { path: 'user_id' },
            lean: true,
        })
        //test subdomain : testing2
        if (!company) {
            return errorResponder(res, 404, "This message has does not belong to any domain or vendor")
        }
        //users message to vendor
        const response = await this.service.sendEmail({
            from: 'info@israelbiblecamp.com',
            to: company.user_id.email,
            templatePath: 'email_templates/contact-us.pug',
            data: {
                content: req.body.content,
                subject: req.body.subject,
                fullName: req.body.fullName
            },
        })

        // vendors reply to user
        const vendorReply = await await this.service.sendEmail({
            from: 'info@israelbiblecamp.com',
            to: req.body.email,
            inReplyTo: response.messageId,
            references: [response.messageId],
            templatePath: 'email_templates/vendor-contact-us-reply.pug',
            data: {
                subject: 'Confirming Message recived',
                fullName: req.body.fullName,
                webSite: `https://${company.subdomain}.iMarketplace.world`,
                contactNumber: "+109092738874"
            },
        })

        return successResponder(res)
    }
}

module.exports = new ContactUsController();
