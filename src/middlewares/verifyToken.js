
import jwt from 'jsonwebtoken';

export function getVerifyToken(req,res, next){
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, process.env.jwt_secret);
    req.user = decoded;
    next()
}
