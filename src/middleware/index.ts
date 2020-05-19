const jwt = require( 'jsonwebtoken' );

export const authenticate = ( req, res, next ) => {
	const authHeader = req.headers.authorization;
	const token = authHeader
		? authHeader.split( ' ' )[1]
		: req.cookies.token;

	if ( token ) {
		jwt.verify( token, 'secret-to-update', ( err, data ) => {
			if ( err ) {
				return res.sendStatus( 403 );
			}

			req.user = data.user;
			return next();
		} );
	} else {
		res.sendStatus( 401 );
	}
};


export default authenticate;
