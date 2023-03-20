import { UserEdit } from "./views/UserEdit";
import { User } from "./models/User";

const user = User.buildUser({name: 'NAME', age: 29})

const root = document.getElementById('root')
if(root) {
  const userEidt = new UserEdit(
    root,
    user
  )
  userEidt.render()
  console.log(userEidt)
}
else {
  throw new Error('Root element not found')
}
