import { BaseModel } from 'pointyapi/models';

// Typeorm
import { Column, PrimaryGeneratedColumn } from 'typeorm';

// Validation
import { IsOptional, Length, IsDate } from 'class-validator';

// Bodyguards
import {
	OnlyAdminCanWrite,
	CanSearch,
	OnlyAdminCanRead
} from 'pointyapi/bodyguard';
import { UserRole } from 'pointyapi/enums';

// Email
import { MailerModule } from './index';

/**
 * Email Template Entity
 */
export class BaseEmailTemplate extends BaseModel {
	// ID
	@PrimaryGeneratedColumn()
	@OnlyAdminCanRead()
	public id: string = undefined;

	// Time Created
	@Column({ type: 'timestamp', default: new Date() })
	@IsDate()
	@IsOptional()
	@OnlyAdminCanRead()
	public timeCreated: Date = undefined;

	// Keyname
	@Column({ unique: true })
	@Length(1, 250)
	@OnlyAdminCanRead()
	@OnlyAdminCanWrite()
	@CanSearch(UserRole.Admin)
	public keyname: string = undefined;

	// Subject
	@Column()
	@Length(1, 250)
	@OnlyAdminCanRead()
	@OnlyAdminCanWrite()
	@CanSearch(UserRole.Admin)
	public subject: string = undefined;

	// Body
	@Column()
	@OnlyAdminCanRead()
	@OnlyAdminCanWrite()
	public body: string = undefined;

	/**
	 * afterPost - Initialize Mailgun Template
	 */
	public async afterPost(request, response) {
		await MailerModule.initTemplate(this.keyname);

		return true;
	}

	/**
	 * afterPatch - Initialize Mailgun Template
	 */
	public async afterPatch(request, response) {
		await MailerModule.initTemplate(this.keyname);

		return true;
	}
}
