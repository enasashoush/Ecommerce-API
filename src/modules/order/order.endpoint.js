import { roles } from "../../middleware/auth.js"

const orderEndPoints = {
    create: [roles.User]
}

export default orderEndPoints