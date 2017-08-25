module.exports = function(req, res, next, error, data){
	if (error === 'ERROR_NO_TOKEN'){
		//token not supplied
		//handle error case
		res.badRequest('No token provided');
	}
	else if (error === 'ERROR_INVALID_TOKEN'){
		//token failed verification
		//handle error case
		res.badRequest('Supplied token is invalid');
	}
	else if (error){
		//some other error (this should never happen!) occurred
		//handle as appropriate
		console.log(error);
		res.serverError('Something unexpected happen! Our engineers are already looking into this...')
	}
	else if (data.error){
		//there was no error with verifying the token, thus user id can be found in data.userId
		//there was however an error in getting user info from firebase using the id
		res.badRequest(data);
	}
	else {
		//data.userId contains firebase user id
		//data.user contains user profile information

		//do your stuff
		req.user = data;

		//REMEMBER TO CALL NEXT WHEN DONE
		next();
	}
}