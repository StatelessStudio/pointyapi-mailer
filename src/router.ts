import { onlyAdmin } from 'pointyapi/guards';
import { getFilter, postFilter, patchFilter } from 'pointyapi/filters';
import {
	postEndpoint,
	patchEndpoint,
	deleteEndpoint,
	getEndpoint
} from 'pointyapi/endpoints';
import { setModel } from 'pointyapi';

export function createRouter(router, emailTemplateType) {
	async function loader(request, response, next) {
		if (await setModel(request, response, emailTemplateType)) {
			next();
		}
	}

	// Create
	router.post('/', loader, onlyAdmin, postFilter, postEndpoint);
	router.get('/', loader, onlyAdmin, getFilter, getEndpoint);
	router.patch(`/:id`, loader, onlyAdmin, patchFilter, patchEndpoint);
	router.delete(`/:id`, loader, onlyAdmin, deleteEndpoint);

	return router;
}
