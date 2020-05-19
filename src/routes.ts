import AuthController from './controller/AuthController';
import UserController from './controller/UserController';
import SessionController from './controller/SessionController';
import { authenticate } from './middleware';

export const Routes = [{
	method: 'post',
	route: '/auth/register',
	controller: AuthController,
	action: 'register',
}, {
	method: 'post',
	route: '/auth/login',
	controller: AuthController,
	action: 'login',
}, {
	method: 'post',
	route: '/auth/check',
	controller: AuthController,
	middleware: authenticate,
	action: 'check',
}, {
	method: 'post',
	route: '/auth/logout',
	controller: AuthController,
	middleware: authenticate,
	action: 'logout',
}, {
	method: 'get',
	route: '/users/:id/sessions',
	controller: UserController,
	middleware: authenticate,
	action: 'getSessions',
}, {
	method: 'post',
	route: '/sessions',
	controller: SessionController,
	middleware: authenticate,
	action: 'create',
}];

export default Routes;
