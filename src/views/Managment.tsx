import AdminLayout from "../components/Layout/AdminLayout"
import Companies from "./Companies"
import Departments from "./Departments"
import Roles from "./Roles"

const Managment = () => { 
    return (
        
           <AdminLayout>
            <Roles />
            <Departments />
            <Companies />
            <div></div>
           </AdminLayout>
    )
}

export default Managment