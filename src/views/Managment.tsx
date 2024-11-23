import AdminLayout from "../components/Layout/AdminLayout"
import Companies from "./Companies"
import Departments from "./Departments"
import Permissions from "./Permissions"
import Roles from "./Roles"

const Managment = () => { 
    return (
        
           <AdminLayout>
            <Roles />
            <Departments />
            <Companies />
            <Permissions />
           </AdminLayout>
    )
}

export default Managment