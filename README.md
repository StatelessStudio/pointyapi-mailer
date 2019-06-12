# PointyAPI User Mailer Module

[Created by Stateless Studio](https://stateless.studio)

## Installation

`npm i pointyapi-mailer`

## Step 1: Create Model

Create the following Model file:

`/src/models/email-template.ts`
```typescript
// Typeorm Columns
import { Entity } from 'typeorm';
import { BaseEmailTemplate } from 'pointyapi-mailer/model';

/**
 * EmailTemplate Entity
 */
@Entity()
export class EmailTemplate extends BaseEmailTemplate {}

```

## Step 2: Create Router

Create this router file:

`/src/routers/email-template.ts`
```typescript
import { Router } from 'express';
import { createRouter } from 'pointyapi-mailer/router';
import { EmailTemplate } from '../models/email-template';

let router: Router = Router();

router = createRouter(router, EmailTemplate);

export const emailTemplateRouter: Router = router;
```

## Step 3: Initialize

### Import module:

`/src/server.ts`
```typescript

...

// Import email module
import { MailerModule } from 'pointyapi-mailer';
import { EmailTemplate } from './models/email-template';
import { emailTemplateRouter } from './routes/email-template';

...

```

### Add EmailTemplate model to setEntities

`/src/server.ts`
```typescript
	...

	await pointy.db
		.setEntities([
			...
			EmailTemplate // Add this line
		])
		.connect(ROOT_PATH)
		.catch((error) => pointy.error('Error', error));

	...

```

### Add template router to app

`/src/server.ts`
```typescript
pointy.before = async (app) => {
	...
	app.use('/api/v1/email-template', emailTemplateRouter); // Add this line
	...

```

### Initialize MailerModule
`/src/server.ts`
```typescript
pointy.before = async (app) => {
	...

	// Mailgun
	MailerModule.init(EmailTemplate);

	...
```