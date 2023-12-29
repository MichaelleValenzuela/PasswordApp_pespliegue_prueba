

import mongoose from "mongoose";
import { varsConfig } from "./varsConfig";


export const configDB = async () => {
    try {
        await mongoose.connect(varsConfig.ADRESS_MONGO);

        console.log("DB is connected ;)");
    } catch (error) {
        console.log(error);
    }
}

