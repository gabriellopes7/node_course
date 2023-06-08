const data = {
    employees : require('../model/employees.json'),
    setEmployees: function(data) { this.employees = data}
}


const getAllEmployees = async (req,res)=>{
    await res.json(data.employees)
}

const createNewEmployee = async (req,res)=>{
    const newEmployee = {
        id: data.employees[data.employees.length-1].id + 1 || 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }
    if(!newEmployee.firstname || !newEmployee.lastname){
        return res.status(400).json({'message': 'First and last names are required'})
    }

    await data.setEmployees([...data.employees, newEmployee])
    res.status(201).json(data.employees)
}

const updateEmployee = async(req,res)=>{
    const employee = data.employees.find(e => e.id === parseInt(req.body.id))
    if(!employee){
        return res.status(400).json({"message": `Employee ID ${req.body.id} not found`})
    }
    if(req.body.firstname) employee.firstname = req.body.firstname
    if(req.body.lastname) employee.lastname =req.body.lastname
    const filteredArray = data.employees.filter(e => e.id !== parseInt(req.body.id))
    const unsortedArray = [...filteredArray, employee]
    await data.setEmployees(unsortedArray.sort((a,b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
    res.json(data.employees)
} 

const deleteEmployee = async (req,res)=>{
    const employee = data.employees.find(e=> e.id === parseInt(req.body.id))
    if(!employee){
        return res.status(400).json({'message': `Employee ID ${req.body.id} not found`}) 
    }
    const filteredArray = data.employees.filter(e=> e.id !== parseInt(req.body.id))
    await data.setEmployees([...filteredArray])
    res.json(data.employees) 
}

const getEmployee = async(req,res)=>{
    const employee = data.employees.find(e => e.id === parseInt(req.params.id))
    if(!employee){
        return res.status(400).json({'message': `Employee ID ${req.params.id} not found`}) 
    }
    res.json(employee)
}

module.exports = {
    getAllEmployees,
    updateEmployee,
    createNewEmployee,
    deleteEmployee,
    getEmployee
}