import {Navigate} from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = props => {
  console.log("pr props:", props.children);
  const token = Cookies.get('jwt_token');
  if (token === undefined) {
    return <Navigate to="/login" />
  }
  return props.children
}

export default ProtectedRoute;
