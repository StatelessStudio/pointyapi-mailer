import { NodeMailgun } from 'ts-mailgun';
import { getRepository } from 'typeorm';

export class PointyMailer extends NodeMailgun {
	public emailTemplateType;

	/**
	 * Log
	 */
	public log(...data) {
		console.log('[Mailer]', data);
	}

	/**
	 * Initialize this
	 * @param emailTemplateType EmailTemplate type
	 */
	init(emailTemplateType?) {
		this.emailTemplateType = emailTemplateType;

		if (!this.emailTemplateType) {
			this.log('PointyAPI Mailer requires emailTemplateType');
			process.exit();
		}

		this.apiKey = process.env.MAILGUN_KEY;
		this.domain = process.env.MAILGUN_DOMAIN;
		this.fromEmail = process.env.MAILGUN_FROMEMAIL;
		this.fromTitle = process.env.SITE_TITLE;

		super.init();

		this.initTemplates().catch((error) => {
			this.log(error);
			throw new Error('Could not initialize templates.');
		});

		this.initMailingList(process.env.MAILGUN_NEWSLETTER);

		// Load this header/footer
		this.loadHeaderTemplate('assets/html/email-header.html');
		this.loadFooterTemplate('assets/html/email-footer.html');
		this.unsubscribeLink = false;

		return this;
	}

	/**
	 * Initialize an email template
	 * @param name string Keyname of the template
	 */
	initTemplate(name: string) {
		return new Promise(async (accept, reject) => {
			this.templates[name] = await getRepository(this.emailTemplateType)
				.findOne({ keyname: name })
				.catch((error) => reject(error));

			accept();
		});
	}

	/**
	 * Initialize email templates
	 */
	initTemplates() {
		return new Promise(async (accept, reject) => {
			const results = await getRepository(this.emailTemplateType)
				.find({})
				.catch((error) => reject(error));

			if (results) {
				for (const result of results) {
					this.templates[result['keyname']] = result;
				}

				accept();
			}
			else {
				reject();
			}
		});
	}

	/**
	 * Middleware to post a user to the mailing list
	 */
	public async postUserToList(request, response, next) {
		// Add to mailing list
		let status = true;

		await this.listAdd(
			request.body.email,
			request.body.email,
			{}
		).catch((error) => {
			status = false;

			if (`${error}`.includes('already exists')) {
				response.sendStatus(204);

				return false;
			}

			response.error('Could not add email');
			this.log('Could not add email: ', error);
		});

		if (status) {
			response.sendStatus(204);
		}
	}
}

export const MailerModule: PointyMailer = new PointyMailer();
