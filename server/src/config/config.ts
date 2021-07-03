import {createConnection } from "typeorm"


const conn = async () => await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "mohsin123",
    database: "sale",
    entities: [
        __dirname + "../entity/*.js"
        ] , 
    synchronize: true,
}).then(async (/*connection : Connection*/) => {
    console.log('connection is been establish')
}).catch(error => console.log(error));

export default conn 