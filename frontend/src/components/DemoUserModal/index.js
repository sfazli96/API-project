import { useDispatch } from 'react-redux';
import { setDemoUser } from '../../store/session';

function DemoUserButton() {
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch(setDemoUser(true))}>
      Login as Demo User
    </button>
  );
}

export default DemoUserButton
