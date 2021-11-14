const express = require("express");
const {v4: uuidv4} = require ("uuid");

const app = express();

app.use(express.json());

const customers = [];
/**
 * DADOS PARA ABERTURA DE CCONTA
 * cpf- string
 * name - string
 * id - uuid
 * statement []
 */
//Criação da Conta - Validando CPF
app.post("/account", (request, response) => {
    const { cpf, name } = request.body;
    
    //validação CPF
    const customersAlreadyExists = customers.some((customers) => customers.cpf === cpf);
    
    //RetornoERROR - CPF já Cadastrado
    if (customersAlreadyExists) {
        return response.status(400).json({error: "Customer already exists!"});
    }    
        customers.push({
            cpf,
            name,
            id: uuidv4(),
            statement: [],
        });
        //Retorno do Cadastro
        return response.status(201).send();
    });


//Busca do extrato bancário
app.get("/statement", (request, response) => {
    //Obs: headers utilizado no lugar de params pq futuramente usará tokens no headers
    const{cpf} = request.headers;
    const customer = customers.find(customer => customer.cpf === cpf);

    if(!customer) {
        return response.status(400).json({error: "Customer not found"})
    }

    return response.json(customer.statement);
});

app.listen(3333);
