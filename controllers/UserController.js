import User from "../models/user.js";

export const retrieveUserName = async (req, res, next) => {
    
    try {
        
        const patient_id = "66a5a24db1507dbec0f15541";
        const user = await User.findOne({ _id: patient_id}).select('firstname -_id');;
        res.status(200).json(user);
        
    } catch (error) {

        res.status(400).json(error);
        
    }

}

export const retrieveUserDetails = async (req, res, next) => {
    
    try {
        
        const patient_id = "66a5a24db1507dbec0f15541";
        const user = await User.findOne({ _id: patient_id});
        res.status(200).json(user);
        
    } catch (error) {

        res.status(400).json(error);
        
    }

}