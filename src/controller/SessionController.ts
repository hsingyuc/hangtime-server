import { getRepository } from 'typeorm';
import { Request } from 'express';
import { Session } from '../entity/Session';

export default class SessionController {
	private sessionRepository = getRepository( Session );

	async create( request: Request ) {
		const sessionData = { ...request.body, user: request.user.id };
		const session = this.sessionRepository.create( sessionData );
		return this.sessionRepository.save( session );
	}
}
