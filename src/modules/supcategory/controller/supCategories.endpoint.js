import { roles } from "../../../middleware/auth.js"


const supCategoryEndPoints = {
    create:[roles.Admin],
    update:[roles.Admin]

}

export default supCategoryEndPoints