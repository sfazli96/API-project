import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDemoUser } from '../../store/session';

function DemoUserButton() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setDemoUser())
  }, [dispatch])
  return (
    <button onClick={() => dispatch(setDemoUser(true))}>
      Login as Demo User
    </button>

  );
}

export default DemoUserButton
