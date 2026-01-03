const admin = require('../firebase/admin');

async function verifyFirebaseToken(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({message: 'Unauthorized access, no token'});
    }
    const token = authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({message: 'Unauthorized access, invalid token'});
    }
    try{
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.tokenEmail = decodedToken.email;
        next();
    } catch(error){
        console.error(error);
        res.status(401).json({message: 'Unauthorized access, wrong token'});
    }
}

module.exports = verifyFirebaseToken;