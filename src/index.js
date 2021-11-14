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

//Middleware

function verifyIfExistsAccountCPF(request, response, next) {
    //Obs: headers utilizado no lugar de params pq futuramente usará tokens no headers
    const{cpf} = request.headers;

    const customer = customers.find(customer => customer.cpf === cpf);

    if(!customer) {
        return response.status(400).json({error: "Customer not found"})
    }

    request.customer = customer;

    return next();
}


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


//Tudo que estiver abaixo deste middleware validará o CPF    
//app.use(verifyIfExistsAccountCPF);

//Busca do extrato bancário
app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
    const {customer} = request;
    return response.json(customer.statement);
});

app.listen(3333);
