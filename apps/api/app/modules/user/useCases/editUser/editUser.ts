import User from '../../models/User';
import {validate} from './validation';

interface Props {
  name: string;
}

export function editUser() {
  async function execute(props: Props, user: User) {
    const {name} = props;

    await user.merge({name}).save();
    await user.refresh();

    return user;
  }

  return {
    execute,
    validate,
  };
}
