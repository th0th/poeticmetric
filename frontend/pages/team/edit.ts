import { UserForm } from "../../pageComponents";
import { withAuth } from "../../components";

export default withAuth(UserForm, true, true);
