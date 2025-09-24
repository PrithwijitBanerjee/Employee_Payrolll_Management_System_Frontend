const Endpoints = {
    /** ... Authentication related endpoints ... **/
    register: "login",
    login: "login",

    /** ...get all roles public route ... **/
    getAllRolesPublic: "get-role",

    /** ... role related endpoints ... **/
    addRole: "admin/create-role",
    updateRole: "admin/update-role",
    deleteRole: "admin/delete-role",
    getRoleById: "admin/get-role",

};

export const Logout = 419;

export default Endpoints;