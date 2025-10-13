const Endpoints = {
    /** ... Authentication related endpoints ... **/
    register: "register",
    login: "login",

    /** ...get all roles public route ... **/
    getAllRolesPublic: "get-role",

    /** ... role related endpoints ... **/
    addRole: "admin/create-role",
    updateRole: "admin/update-role",
    deleteRole: "admin/delete-role",
    getRoleById: "admin/get-role",

    /** ... project help related endpoints ... **/
    addProjectHelp: "admin/create-projectHelp",
    getProjectHelp: "admin/getAll-projectHelp",
    getProjectHelpById: "/admin/get-projectHelp",
    updateProjectHelp: "admin/update-projectHelp",
    delProjectHelp: "admin/delete-projectHelp",
    getProjectHelpByTag: "get-projectHelp-tag",

    /** ... department related endpoints ... **/
    addDepartment: "admin/create-department",
    getAllDepartments: "admin/get-Departments",
    getDepartmentByCode: "admin/get-department",
    updateDepartment: "admin/update-department",
    deleteDepartment: "admin/delete-department",

    /** .... designation related endpoints ... **/
    addDesignation: "admin/create-designation",
    getAllDesignations: "admin/get-designations",
    getDesignationByCode: "admin/get-designation",
    updateDesignation: "admin/update-designation",
    deleteDesignation: "admin/delete-designation",

    /** ... client related endpoints ... **/
    addClient: "admin/create-client",
    getAllClients: "admin/get-client",
    getClientByCode: "admin/get-client",
    updateClient: "admin/update-client",
    deleteClient: "admin/delete-client",

    /** ... employee related endpoints ... **/
    addEmployee: "admin/create-employee",
    getAllEmployees: "admin/get-employes",
    getEmployeeById: "admin/get-employee",
    updateEmployee: "admin/update-employee",
    deleteEmployee: "admin/delete-employee",

};

export const Logout = 419;

export default Endpoints;